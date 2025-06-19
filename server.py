from glob import glob
from tkinter import filedialog
import pandas as pd
import eel
from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
from tkinter import Tk
import webbrowser
from typing import Union
import platform
import os
import subprocess

eel.init('web')
try:
    eel.start("main.html", block=False, size=(1680,1050), cmdline_args=["--disable-plugins"])
except:
    eel.start("main.html", mode="default", block=False)


def open_file_with_default_app(filepath):
    """
    Opens a file with the default application of the operating system.

    Args:
        filepath (str): The path to the file you want to open.
    """
    try:
        if platform.system() == "Windows": 
            os.startfile(filepath) #startfile will only work in windows
        elif platform.system() == "Darwin":  # macOS
            subprocess.call(('open', filepath))
        else:  # Linux and other Unix-like systems
            subprocess.call(('xdg-open', filepath))
        print(f"Successfully opened '{filepath}' with the default application.")
    except Exception as e:
        print(f"Error opening '{filepath}': {e}")


def read_sample_df(file: str) -> Union[pd.DataFrame, None]:
    df = None
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False, nrows=10)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file, nrows=10)
    return df


def read_df(file: str) -> Union[pd.DataFrame, None]:
    df = None
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file)
    return df


@eel.expose
def fileOpen(file_path):
    file_path = file_path.rstrip("Open File")
    open_file_with_default_app(file_path)
    return "File Opened"


@eel.expose
def openFolder(folder_path):
    webbrowser.open(folder_path)
    return "Folder Opened"


@eel.expose
def getFiles(get_folder="False"):
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    file_names = []
    if get_folder == "True":
        folder_path = filedialog.askdirectory(
            title="This will select all 'csv','tsv', 'xls' or 'xlsx' files in all sub directories")
        for ext in ["*.csv", "*.tsv", "*.xlsx", "*.xls"]:
            for path, subdir, files in os.walk(folder_path):
                for file in glob(os.path.join(path, ext)):
                    file_names.append(file)
    else:
        file_names = askopenfilenames(
            title="Open 'csv','tsv', 'xls' or 'xlsx' files", parent=root
        )
    root.destroy()
    extensions = ["csv", "tsv", "xlsx", "xls"]
    file_names = list(filter(lambda x: x.split(
        ".")[-1] in extensions, file_names))
    file_names = {file_name: read_sample_df(
        file_name).columns.to_list() for file_name in file_names}
    return file_names


def columnCleansing(col_dict):
    out_dict = {}
    for k, v in col_dict.items():
        for i in v.strip(",").split(","):
            out_dict[i] = k
    return out_dict


@eel.expose
def clearList():
    global all_files
    all_files = []
    return "Done clearing df list"


@eel.expose
def combineFiles(file_col_inp):
    file = file_col_inp[0]
    rename_keys = columnCleansing(file_col_inp[1])
    df = readDf(file)
    if isinstance(df, pd.DataFrame):
        df = df[list(set(df.columns.tolist()) & (set(rename_keys.keys())))].copy()
        df = df.rename(columns=rename_keys).copy()
        all_files.append(df)
        return f"Transforming {file}"
    return f"Can't read file : {file}"

@eel.expose
def finalCombine():
    df = pd.concat(all_files,ignore_index=True)
    root = Tk()  # this is to close the dialogue box later
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    save_file = asksaveasfilename(filetypes=[("All files", "*.*")])

    if len(save_file) > 0:
        if save_file.endswith(".xlsx"):
            df.to_excel(save_file, index=False)
        elif save_file.endswith(".xls"):
            df.to_excel(save_file, index=False)
        elif save_file.endswith(".tsv"):
            df.to_csv(save_file, index=False)
        elif save_file.endswith(".csv"):
            df.to_csv(save_file, index=False)
        else:
            save_file = save_file.split(".")[0] + ".csv"
            df.to_csv(save_file, index=False)
        user_output = f"All files are combined and saved as {save_file}"

    else:
        user_output = "Saving files cancelled"
    root.destroy()
    return user_output


while True:
    eel.sleep(10)
