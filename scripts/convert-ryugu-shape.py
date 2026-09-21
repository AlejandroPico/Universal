"""Optional source rebuild: pip install spiceypy; python scripts/convert-ryugu-shape.py.
Hayabusa2/JAXA DARTS SPICE bundle, DOI 10.17597/isas.darts/hyb2-00600.
Converts measured DSK plates/vertices losslessly in topology, retaining km units.
"""
from pathlib import Path
from urllib.request import urlopen
import tempfile
import gzip
import spiceypy as spice
SOURCE = 'https://naif.jpl.nasa.gov/pub/naif/pds/pds4/hyb2/hyb2_spice/spice_kernels/dsk/ryugu_shape_spc_49k_v20200323.bds'
TARGET = Path(__file__).resolve().parents[1] / 'public/science-models/ryugu.obj'
def convert(path):
    handle = spice.dasopr(str(path))
    try:
        descriptor = spice.dlabfs(handle)
        nv, np = spice.dskz02(handle, descriptor)
        vertices = spice.dskv02(handle, descriptor, 1, nv)
        plates = spice.dskp02(handle, descriptor, 1, np)
        TARGET.parent.mkdir(parents=True, exist_ok=True)
        with TARGET.open('w') as out:
            out.write('# Hayabusa2 / JAXA, SPC v20200323; units km; native body-fixed Z pole.\n')
            out.write('# Source: ' + SOURCE + '\n# DOI: 10.17597/isas.darts/hyb2-00600; CC BY 4.0\n')
            for x, y, z in vertices:
                out.write(f'v {x:.10g} {y:.10g} {z:.10g}\n')
            for a, b, c in plates:
                out.write(f'f {a} {b} {c}\n')
        TARGET.with_suffix('.obj.gz').write_bytes(gzip.compress(TARGET.read_bytes(), mtime=0))
        print(f'Ryugu: {nv} vertices, {np} faces -> {TARGET}')
    finally:
        spice.dascls(handle)
if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        convert(Path(sys.argv[1]))
    else:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'ryugu.bds'
            path.write_bytes(urlopen(SOURCE, timeout=60).read())
            convert(path)
