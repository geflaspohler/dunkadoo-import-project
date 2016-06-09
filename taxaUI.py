#
# UI Module for Taxa convert CSV to JSON
#


import sys
import os

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

import taxaUI_support

def vp_start_gui():
    '''Starting point when module is the main routine.'''
    global val, w, root
    global taxa_tool_path
    
    taxa_tool_path = os.getcwd()
    
    root = Tk()
    root.title('Dunkadoo CSV to JSON Taxa Converter')
    iconPath = os.getcwd() + '/DunkadooHeader.gif'
    img = PhotoImage(file=iconPath)
    root.tk.call('wm', 'iconphoto', root._w, img)
    root.geometry('900x400')
    taxaUI_support.set_Tk_var()
    w = Taxa_CSVtoJSON_Tool (root)
    taxaUI_support.init(root, w)
    root.mainloop()

w = None
def create_Taxa_CSVtoJSON_Tool (root, param=None):
    '''Starting point when module is imported by another program.'''
    global w, w_win, rt
    rt = root
    w = Toplevel (root)
    w.title('Dunkadoo CSV to JSON Taxa Converter')
    w.geometry('900x400+480+147')
    taxaUI_support.set_Tk_var()
    w_win = Taxa_CSVtoJSON_Tool (w)
    taxaUI_support.init(w, w_win, param)
    return w_win

def destroy_Taxa_CSVtoJSON_Tool ():
    global w
    w.destroy()
    w = None


class Taxa_CSVtoJSON_Tool:
    def __init__(self, master=None):
        _bgcolor = '#ffffff'  # X11 color: 'gray85'
        _fgcolor = '#000000'  # X11 color: 'black'
        _compcolor = '#d9d9d9' # X11 color: 'gray85'
        _ana1color = '#d9d9d9' # X11 color: 'gray85' 
        _ana2color = '#d9d9d9' # X11 color: 'gray85' 
        font10 = "-family Tahoma -size 16 -weight bold -slant roman  " + \
            "-underline 0 -overstrike 0"
        font11 = "-family Tahoma -size 12 -weight bold -slant roman  " + \
            "-underline 0 -overstrike 0"
        font12 = "-family Tahoma -size 14 -weight normal -slant roman  " + \
            "-underline 0 -overstrike 0"
        font13 = "-family Tahoma -size 8 -weight bold -slant roman  " + \
            "-underline 0 -overstrike 0"
        font15 = "TkDefaultFont " + \
            ""
        self.style = ttk.Style()
        if sys.platform == "win32":
            self.style.theme_use('winnative')
        self.style.configure('.',background=_bgcolor)
        self.style.configure('.',foreground=_fgcolor)
        self.style.configure('.',font="TkDefaultFont")
        self.style.map('.',background=
            [('selected', _compcolor), ('active',_ana2color)])
        master.configure(background=_bgcolor)
        master.configure(highlightbackground="#ffffff")
        master.configure(highlightcolor="black")

        
        self.Message1 = Message (master)
        self.Message1.place(relx=0.18,rely=0.03,relheight=0.07,relwidth=0.66)
        self.Message1.configure(background="#ffffff")
        self.Message1.configure(font=font10)
        self.Message1.configure(foreground="#000000")
        self.Message1.configure(highlightbackground="#d9d9d9")
        self.Message1.configure(highlightcolor="black")
        self.Message1.configure(text='''Taxa CSVtoJSON Tool''')
        self.Message1.configure(width=594)

        self.Message2 = Message (master)
        self.Message2.place(relx=0.03,rely=0.21,relheight=0.07,relwidth=0.27)
        self.Message2.configure(anchor=W)
        self.Message2.configure(background="#ffffff")
        self.Message2.configure(font=font11)
        self.Message2.configure(foreground="#000000")
        self.Message2.configure(highlightbackground="#ffffff")
        self.Message2.configure(highlightcolor="black")
        self.Message2.configure(text='''1. Taxonomy Name''')
        self.Message2.configure(width=244)

        self.TaxonNameEntry = Entry (master)
        self.TaxonNameEntry.place(relx=0.34,rely=0.22,relheight=0.06
                ,relwidth=0.5)
        self.TaxonNameEntry.configure(background="white")
        self.TaxonNameEntry.configure(disabledforeground="#a3a3a3")
        font15 = "-family Arial -size 12 -weight normal -slant roman  " + \
            "-underline 0 -overstrike 0"
        self.TaxonNameEntry.configure(font=font15)
        self.TaxonNameEntry.configure(foreground="#000000")
        self.TaxonNameEntry.configure(highlightbackground="#d9d9d9")
        self.TaxonNameEntry.configure(highlightcolor="black")
        self.TaxonNameEntry.configure(insertbackground="black")
        self.TaxonNameEntry.configure(selectbackground="#c4c4c4")
        self.TaxonNameEntry.configure(selectforeground="black")
        self.TaxonNameEntry.configure(textvariable=taxaUI_support.taxonNameText)

        self.Label2 = Label (master)
        self.Label2.place(relx=0.39,rely=0.15,height=21,width=300)
        self.Label2.configure(activebackground="#f9f9f9")
        self.Label2.configure(activeforeground="black")
        self.Label2.configure(background="#ffffff")
        self.Label2.configure(disabledforeground="#a3a3a3")
        self.Label2.configure(font=font13)
        self.Label2.configure(foreground="black")
        self.Label2.configure(highlightbackground="#d9d9d9")
        self.Label2.configure(highlightcolor="black")
        self.Label2.configure(text='''New Taxonomy Name''')

        self.Message3 = Message (master)
        self.Message3.place(relx=0.03,rely=0.28,relheight=0.07,relwidth=0.23)
        self.Message3.configure(anchor=W)
        self.Message3.configure(background="#ffffff")
        self.Message3.configure(font=font11)
        self.Message3.configure(foreground="#000000")
        self.Message3.configure(highlightbackground="#d9d9d9")
        self.Message3.configure(highlightcolor="black")
        self.Message3.configure(text='''2. CSV File''')
        self.Message3.configure(width=244)

        self.Message3A = Message (master)
        self.Message3A.place(relx=0.06,rely=0.33,relheight=0.08,relwidth=0.20)
        self.Message3A.configure(anchor=W)
        self.Message3A.configure(background="#ffffff")
        self.Message3A.configure(foreground="#000000")
        self.Message3A.configure(highlightbackground="#d9d9d9")
        self.Message3A.configure(highlightcolor="black")
        self.Message3A.configure(text='''Choose CSV File to Convert''')
        self.Message3A.configure(width=224)

        self.fileButton1 = Button (master)
        self.fileButton1.place(relx=0.50,rely=0.39,height=21,width=141)
        self.fileButton1.configure(activebackground="#f4f4f4")
        self.fileButton1.configure(activeforeground="#000000")
        self.fileButton1.configure(background=_bgcolor)
        self.fileButton1.configure(command=taxaUI_support.promptCSVFile)
        self.fileButton1.configure(disabledforeground="#a3a3a3")
        self.fileButton1.configure(font=font13)
        self.fileButton1.configure(foreground="#000000")
        self.fileButton1.configure(highlightbackground="#d9d9d9")
        self.fileButton1.configure(highlightcolor="black")
        self.fileButton1.configure(pady="0")
        self.fileButton1.configure(text='''Select CSV File''')

        self.Label1 = Label (master)
        self.Label1.place(relx=0.34,rely=0.33,height=19,width=421)
        self.Label1.configure(background="#ffffff")
        self.Label1.configure(disabledforeground="#ffffff")
        self.Label1.configure(foreground="#000000")
        self.Label1.configure(text='''Please Choose a CSV File to Convert''')
        self.Label1.configure(width=421)

        self.menubar = Menu(master,bg=_bgcolor,fg=_fgcolor)
        master.configure(menu = self.menubar)



        self.Message8 = Message (master)
        self.Message8.place(relx=0.03,rely=0.63,relheight=0.07,relwidth=0.25)
        self.Message8.configure(anchor=W)
        self.Message8.configure(background="#ffffff")
        self.Message8.configure(font=font11)
        self.Message8.configure(foreground="#000000")
        self.Message8.configure(highlightbackground="#d9d9d9")
        self.Message8.configure(highlightcolor="black")
        self.Message8.configure(text='''3. Select Output Folder''')
        self.Message8.configure(width=232)

        self.Message9 = Message (master)
        self.Message9.place(relx=0.05,rely=0.70,relheight=0.08,relwidth=0.24)
        self.Message9.configure(background="#ffffff")
        self.Message9.configure(foreground="#000000")
        self.Message9.configure(highlightbackground="#d9d9d9")
        self.Message9.configure(highlightcolor="black")
        self.Message9.configure(text='''Select a folder for the JSON file.''')
        self.Message9.configure(width=224)

        self.Label6 = Label (master)
        self.Label6.place(relx=0.34,rely=0.65,height=19,width=421)
        self.Label6.configure(background="#ffffff")
        self.Label6.configure(disabledforeground="#ffffff")
        self.Label6.configure(foreground="#000000")
        self.Label6.configure(text='''Please Choose an Output Folder for the JSON file''')
        self.Label6.configure(width=421)

        self.fileButton2 = Button (master)
        self.fileButton2.place(relx=0.50,rely=0.72,height=21,width=141)
        self.fileButton2.configure(activebackground="#f4f4f4")
        self.fileButton2.configure(activeforeground="#000000")
        self.fileButton2.configure(background=_bgcolor)
        self.fileButton2.configure(command=taxaUI_support.promptOutputFolder)
        self.fileButton2.configure(disabledforeground="#a3a3a3")
        self.fileButton2.configure(font=font13)
        self.fileButton2.configure(foreground="#000000")
        self.fileButton2.configure(highlightbackground="#d9d9d9")
        self.fileButton2.configure(highlightcolor="black")
        self.fileButton2.configure(pady="0")
        self.fileButton2.configure(text='''Select Folder''')


        self.ConvertButton = Button (master)
        self.ConvertButton.place(relx=0.49,rely=0.80,height=38,width=160)
        self.ConvertButton.configure(activebackground="#d9d9d9")
        self.ConvertButton.configure(activeforeground="#000000")
        self.ConvertButton.configure(background=_bgcolor)
        self.ConvertButton.configure(command=taxaUI_support.convertCSVtaxaToJSON)
        self.ConvertButton.configure(disabledforeground="#a3a3a3")
        self.ConvertButton.configure(font=font11)
        self.ConvertButton.configure(foreground="#000000")
        self.ConvertButton.configure(highlightbackground="#d9d9d9")
        self.ConvertButton.configure(highlightcolor="black")
        self.ConvertButton.configure(pady="0")
        self.ConvertButton.configure(text= '''Convert to JSON''')
        

if __name__ == '__main__':
    vp_start_gui()



