
from data import remove_extra_spaces_and_newlines,remove_from_re,clean_and_filter_words,data_process
import time
import json
import os
from glob import glob
def update_successors_with_empty(string_id,old_successors_table):
    id=string_id#unique_id[key]
    old_successors_table[id]={"successor_list":{
        "successors":[],
        "successors_freq":
        {}

    }}
    return old_successors_table
    #pass




def update_dictionaries(file_path):
    """To Do
    * Read the log file
    * Get the static string
    * if the static string already exist in unique dictionary pass,else update the dict and nearest table with empty
    * return okay if updated successfully else false
    
    
    """
    all_strins,successor_table,unique_string=open_database()
    #print("After file opened")
    #print(len(all_strins),len(unique_string),len(successor_table))
    last_id=len(unique_string)
    start=time.time() 
    ids=list(unique_string.keys())
    #print("this is :",ids[10])
    with open(file_path, 'r') as f:
        lines=f.readlines()
    #print(f"total new line in log : {len(lines)}")
    processed_data=[data_process(i) for i in lines]
    joined_with_space=[clean_and_filter_words(i) for i in processed_data]
    new_ids=0
    for line,processed in zip(lines,joined_with_space):
        
        if processed not in ids:
            
            new_ids+=1
            
            all_strins[processed]=line
            unique_string[processed]=last_id
            successor_table=update_successors_with_empty(last_id,successor_table)
            last_id+=1

    
    write_=close_database(all_strins,successor_table,unique_string)
    #print(f"Total New lien : {new_ids}")
    return write_
def close_database(all_string_unique_json,successor_event_table,unique_json):
    try:
        #print(f"\n Closing database \n Length of all_string_unique_json : {len(all_string_unique_json)} \n length of Successor table : {len(successor_event_table)}\n length of unique id : {len(unique_json)}\n")
        with open('database/test/all_string_unique_json.json','w') as f:
            json.dump(all_string_unique_json, f, indent=4)
        with open('database/test/successor_event_table.json','w') as f:
            json.dump(successor_event_table, f, indent=4)
        with open('database/test/unique_json.json','w') as f:
            json.dump(unique_json, f, indent=4)
        return True
    except Exception as e:
        print(f"closing error : {e}")
        return False

def open_database():
    
    #try:
    all_string_unique_json=json.load(open('database/test/all_string_unique_json.json'))
    successor_event_table=json.load(open('database/test/successor_event_table.json'))
    unique_json=json.load(open('database/test/unique_json.json'))
    #print(f"\n Opening Database \n Length of all_string_unique_json : {len(all_string_unique_json)} \n length of unique_json : {len(unique_json)}\n length of all_string_unique : {len(all_string_unique_json)}\n")
    
        
    return all_string_unique_json,successor_event_table,unique_json
 
def all_elements_are_integers(lst):
    return all(isinstance(x, int) for x in lst)


def create_html_file(lines_with_colors,failure_length,okay_length):
    paragraphs = ''
    # Header content with formatted failure_length and okay_length
    header_content = f'''
    <div style="background-color: lightgrey; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
    <center>
        <h1>
            <span style="color: red;">Potential Failure Line: {failure_length}</span>
            &nbsp;
            <span style="color: green;">Non-Failure Line : {okay_length}</span>
        </h1>
        </center>
    </div>
    '''
    
    for ind,item in enumerate(lines_with_colors):
        line = item['line']
        color = item['color']
        paragraphs += f'<p style="color: {color};"> Line Number : {ind} : {line}</p>\n'

    html_content = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Colored Text</title>
    </head>
    <body>
        {header_content}
        {paragraphs}
    </body>
    </html>
    '''
    #f failure_length>0:
    return html_content
    # else:
    #     return "<html><body><h1>No error Found</h1></body></html>"

def check_for_failure(file_path):

    unique_id_to_string,succesor_dict,unique_id=open_database()
    with open(file_path, 'r') as f:
        lines=f.readlines()
    #print(f"total new line in log : {len(lines)}")
    processed_data=[(data_process(i),i) for i in lines]
    sentence_list=[(clean_and_filter_words(i),k) for i,k in processed_data]

    all_log_output =[]
    cause_of_failure_list=[]
    okay_list=[]
    prev_id=None
    for i,k in sentence_list:
        if len(i)<2:
            continue
        cur_id=str(unique_id[i])
        #print("this is a sentence")
        if prev_id==None:               
            prev_id=cur_id
            continue
        neighbors_likelihood=succesor_dict[prev_id]["successor_list"]["successors"]
   
        if not all_elements_are_integers(neighbors_likelihood):
            print(" string capture failed")
            #input()


        if int(cur_id) not in neighbors_likelihood:

            cause_of_failure_list.append(i)
            event_string=k#unique_id_to_string[i]
            all_log_output.append({'line': event_string + ' - string id : '+str(cur_id), 'color': "red"},)

            
        else:
            okay_list.append(i)
            event_string=k#unique_id_to_string[i]
            all_log_output.append({'line': event_string + ' - string id : '+str(cur_id), 'color': "green"},)
        prev_id=cur_id

    # html_content=create_html_file(all_log_output,len(cause_of_failure_list),len(okay_list))
    # final_response={
    #     "Failure_line": len(cause_of_failure_list),
    #     "non_failure_line": len(okay_list),
    #     "html_content": html_content
    # }
    final_response={
        "Failure_line": len(cause_of_failure_list),
        "non_failure_line": len(okay_list),
        "html_content": all_log_output
    }
    return final_response

def update_pass_dict(directory_path):
    dirs=glob(directory_path+'/*')
    for i in dirs:
        update_dictionaries(i)
    all_strins,SuccessorEventTable,unique_id=open_database()
    print("********************")
    print(len(SuccessorEventTable))
    prev_id=None
    count=0
    for ind,path in enumerate(dirs):
        #print(path)

        #print('wo')
        #print(path)
        with open(path, 'r') as f:
            lines=f.readlines()
        #lines=lines[15:]
        processed_data=[data_process(i) for i in lines]      
        joined_with_space=[clean_and_filter_words(i) for i in processed_data]
        check_dict={}

        for line_num, i in enumerate(joined_with_space):
            if len(i)<2:   # 
                continue
            cur_id=str(unique_id[i])
            if prev_id==None:
                prev_id=cur_id
                continue
            #check_order(prev_id,cur_id,path,line_num)
            if cur_id not in SuccessorEventTable[prev_id]["successor_list"]["successors"]:
                SuccessorEventTable[prev_id]["successor_list"]["successors"].append(cur_id)
                count+=1
                SuccessorEventTable[prev_id]["successor_list"]["successors_freq"][cur_id]=1   # If neighbour doesn't exist, add to neighbor list and set the frequency to 1
            else:
                SuccessorEventTable[prev_id]["successor_list"]["successors_freq"][cur_id]+=1   # if neighbour already exists, increase the frequency

            prev_id=cur_id
        os.remove(path)
        
    print(len(SuccessorEventTable))
    print(f"this is total update : {count}")
    close_database(all_strins,SuccessorEventTable,unique_id)

    return True



if __name__ == '__main__':
    update_pass_dict('uploads')
    # print("Cheking this function...")
    # file_path='temp/inline_router-tc07passed.txt'
    # t=update_dictionaries(file_path)
    # print(f" Update : {t}")
    # t=check_for_failure(file_path)
    # print(f"result : {t["Failure_line"]}")

