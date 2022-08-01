from importlib.metadata import files
import eel
from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
from tkinter import Tk
from tkinter import Label

eel.init('web')
eel.start("main.html", mode='default', block=False)


@eel.expose
def getFiles():
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    file_names = askopenfilenames(
        title="Open 'csv','xls', or 'xlsx' files", parent=root
    )
    root.destroy()
    extensions = ["csv", "tsv", "xlsx", "xls"]
    file_names = list(filter(lambda x: x.split(
        ".")[-1] in extensions, file_names))
    print(file_names)
    return file_names


def my_python_method(param1, param2):
    print(param1 + param2)


while True:
    eel.sleep(10)
