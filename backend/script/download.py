from multiprocessing import freeze_support

import asf_search as asf
from datetime import datetime
from os import listdir
from pathlib import Path
import getpass
from tqdm import tqdm
import sys
import argparse

if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='Download image data in .zip format from ASF')

    # Arguments 
    # Downloader Arguments
    parser.add_argument('--outputPathZip', help='Absolute Path to directory where the downloaded files .zip will be saved', required=True)
    parser.add_argument('--username', help='Username to authentification in ASF', required=True)
    parser.add_argument('--password', help='Password to authentification in ASF', required=True)
    parser.add_argument('--polygon', help='Polygon you want images from', required=True)
    parser.add_argument('--dateStart', help='Begining of the period you want download with format YYYY-MM-DD', required=True)
    parser.add_argument('--dateEnd', help='End of the period you want download with format YYYY-MM-DD', required=True)


    # Analyser Arguments 
    args = parser.parse_args()

    # -- Get the parameters
    # Downloader Arguments
    output_path_zip = args.outputPathZip
    username = args.username
    password = args.password
    polygon = args.polygon
    date_start = args.dateStart
    date_end = args.dateEnd


    # -- Format the date
    datetime_format = '%Y-%m-%d'


    freeze_support()
    
    # username = input('Username:')
    # password = getpass.getpass('Password:')
    
    user_pass_session = asf.ASFSession().auth_with_creds(username=username, password=password)
    
    results_with_zips = asf.search(
        intersectsWith=polygon,
        platform=asf.PLATFORM.SENTINEL1,
        processingLevel=asf.PRODUCT_TYPE.GRD_HD,
        start=datetime.strptime(date_start, datetime_format),
        end=datetime.strptime(date_end, datetime_format))
    
    # results_with_zips[0:1].download(path='./downloads7', session=user_pass_session)
    
    for result_zip in tqdm(results_with_zips):
        result_zip.download(path=output_path_zip, session=user_pass_session)
