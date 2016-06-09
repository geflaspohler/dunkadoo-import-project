'''
Created on May 18, 2016

@author: Carol
'''
import sys
import csv
import tkMessageBox

try:
    from Tkinter import *
except ImportError:
    from tkinter import *

try:
    import ttk
    py3 = 0
except ImportError:
    import tkinter.ttk as ttk
    py3 = 1

def set_Tk_var():
    # These are Tk variables used passed to Tkinter and must be
    # defined before the widgets using them are created.
    global taxonNameText
    taxonNameText = StringVar()
    
    global convertStatus
    convertStatus = '''Create JSON File'''

    
#####################################
    global selectedZIP
    global authKey

import os
import tkFileDialog
import taxaUI
import json

def promptCSVFile():
    global selectedCSV
    selectedCSV = tkFileDialog.askopenfilename(parent=root)
    w.Label1.configure(text=str(selectedCSV))


def promptOutputFolder():
    global selectedOUT
    selectedOUT = tkFileDialog.askdirectory(initialdir="/",mustexist=TRUE,parent=root)
    w.Label6.configure(text=str(selectedOUT))

def is_json(csvstring):
    try:
        json_object = json.loads(csvstring)
    except ValueError, e:
        return False
    return True


def convertCSVtaxaToJSON():
    in_file = selectedCSV
    # Make the output file have the same name as the input
    # with ".json" for the extension
    out_file_name = selectedCSV.rsplit("/", 1)[1].rsplit(".")[0]
    out_file = selectedOUT + '/' + out_file_name + '.json'
    csv_dict = {}
    csv_dict['name'] = taxonNameText.get()
    csv_list = []
    with open(in_file) as csvfile:
        reader = csv.DictReader(csvfile)
        title = reader.fieldnames
        for row in reader:
            # each row is a species for our ultimate json output
            species = {}
            for i in range(len(title)):
                # for csv items that are ALREADY json, load them as such
                # otherwise, we'd convert to json twice and get annoying
                # escape characters
                #if title[i] in special_headers and row[title[i]] != '':
                if is_json(row[title[i]]):
                    species[title[i]] = json.loads(row[title[i]])
                else:        
                    species[title[i]] = row[title[i]]

            csv_list.append(species)
        
        csv_dict['Species'] = csv_list    
        with open(out_file, 'w') as f_out:
            f_out.write(json.dumps(csv_dict, sort_keys=False, indent=4, separators=(',', ': '),encoding="utf-8",ensure_ascii=False))
        print "completed CSV to JSON"
        destroy_window()

if __name__ == '__main__':
    taxaUI.vp_start_gui()

def init(top, gui, arg=None):
    global w, top_level, root
    w = gui
    top_level = top
    root = top

def destroy_window ():
    # Function which closes the window.
    global top_level
    top_level.destroy()
    top_level = None

 