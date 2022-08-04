from importlib.metadata import files
import re
import pandas as pd
import eel
from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
from tkinter import Tk
from tkinter import Label

eel.init('web')
eel.start("main.html", mode='default', block=False)


def readSampleDf(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False,nrows=10)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file, nrows=10)
    return df

def readDf(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file)
    return df

@eel.expose
def getFiles():
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    file_names = askopenfilenames(
        title="Open 'csv','xls'files", parent=root
    )
    root.destroy()
    extensions = ["csv", "tsv", "xlsx","xls"]
    file_names = list(filter(lambda x: x.split(
        ".")[-1] in extensions, file_names))
    file_names = {file_name: readSampleDf(file_name).columns.to_list() for file_name in file_names}
    return file_names



def columnCleansing(col_dict):
    out_dict = {}
    for k,v in col_dict.items():
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
    df = df[list(set(df.columns.tolist()) & (set(rename_keys.keys())))].copy()
    df = df.rename(columns=rename_keys).copy()
    all_files.append(df)
    return f"Formating {file}"


@eel.expose
def finalCombine():
    df = pd.concat(all_files,axis=1)
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
