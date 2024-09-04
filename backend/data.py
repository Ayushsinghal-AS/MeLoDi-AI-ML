
import re

from glob import glob
import json
import time
import os

def remove_from_re(text,ip_pattern):
    # Regular expression to match IP addresses
    #ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    
    # Function to clean a single string
    def clean_single_string(single_text):
        return re.sub(ip_pattern, '', single_text)
    
    # If the input is a single string
    if isinstance(text, str):
        return clean_single_string(text)
    # If the input is a list of strings
    elif isinstance(text, list):
        return [clean_single_string(single_text) for single_text in text]
    else:
        raise ValueError("Input must be a string or a list of strings")

def check_failed_in_string(input_string):
    if 'failed' in input_string.lower():
        return True
    else:
        return False
def remove_extra_spaces_and_newlines(text):
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove newline characters
    text = re.sub(r'\n', ' ', text)
    return text.strip()  # Strip leading and trailing spaces


def data_process(input_string):
    # To Do
    # Remove MAC Address
    # Remove IP Address
    # Remove Date 
    # Regex to match the date at the start of the line
    special_characters =  r'[^a-zA-Z0-9\s.]'
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    mac_pattern = r'\b(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})\b'

    # Removeremove_from_re date if line starts with the specified date format
    line=input_string[len("Tue May  7 09:57:23 2024 "):]
    line=remove_from_re(line,r'\b[a-f0-9]+-[a-f0-9]+-[a-f0-9]+-[a-f0-9]+-[a-f0-9]+\b')
    line=remove_from_re(line,mac_pattern)
    line=remove_from_re(line,r'0[xX][0-9a-fA-F]+')
    line=remove_from_re(line,r'\b\d+\b')
    line=remove_from_re(line,ip_pattern)
    line=remove_from_re(line,r'\b\d+\W+|\W+\d+\b')
    line=remove_from_re(line,special_characters)
    
    #line_without_mac=remove_from_re(line_without_ips,mac_pattern)
    
    

    return remove_extra_spaces_and_newlines(line)

def clean_and_filter_words(line):
    # Remove single and double quotes from the line
    line = line.replace("'", "").replace('"', "")
    # Splitting words using specified delimiters
    words = re.split(r'[ \t:,;=|{}\[\]()<>-]+', line.strip())
    filtered_words = []
    for word in words:
        # Filtering conditions applied to each word
        if not re.fullmatch(r'-?\d+(\.\d+)?', word) and \
           not re.fullmatch(r'(0x|0X)?[0-9a-fA-F]+', word) and \
           not re.fullmatch(r'(\d{1,3}\.){3}\d{1,3}', word) and \
           not re.fullmatch(r'([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}', word) and \
           not re.fullmatch(r'[<>\d.]+', word):
            filtered_words.append(word)
    if filtered_words and filtered_words!=' ':
        word_concat = '_'.join(words)
        #sentence_list.append(word_concat)
        #original_lines.append(original.strip())
    else:
        word_concat=""
    return word_concat