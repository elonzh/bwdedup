import json
import platform
import subprocess
from pathlib import Path

import typer

app = typer.Typer()

binary = Path(__file__).parent.joinpath("bin")

if platform.system() == "Windows":
    bw_executable = binary.joinpath("bw.exe")


def list_items(master_password) -> list:
    p = subprocess.run(
        [bw_executable, "list", "items"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        input=f"{master_password}\n",
    )
    p.check_returncode()
    return json.loads(p.stdout)


@app.command()
def run(master_password: str):
    typer.echo(list_items(master_password))


if __name__ == "__main__":
    app()
