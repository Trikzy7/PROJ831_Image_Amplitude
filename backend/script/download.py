from multiprocessing import freeze_support

import asf_search as asf
from datetime import datetime
import os
from pathlib import Path
import getpass
from tqdm import tqdm
import sys
import argparse
from datetime import timedelta



if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='Download image data in .zip format from ASF')

    # Arguments 
    # Downloader Arguments
    # parser.add_argument('--outputPathZip', help='Absolute Path to directory where the downloaded files .zip will be saved', required=True)
    parser.add_argument('--username', help='Username to authentification in ASF', required=True)
    parser.add_argument('--password', help='Password to authentification in ASF', required=True)
    parser.add_argument('--polygon', help='Polygon you want images from', required=True)
    parser.add_argument('--dateStart', help='Begining of the period you want download with format YYYY-MM-DD')
    parser.add_argument('--dateEnd', help='End of the period you want download with format YYYY-MM-DD')

    parser.add_argument('--listDate', help='list of date with format YYYY-MM-DD')



    # Analyser Arguments 
    args = parser.parse_args()

    # -- Get the parameters
    # Downloader Arguments
    # output_path_zip = args.outputPathZip
    username = args.username
    password = args.password
    polygon = args.polygon
    date_start = args.dateStart
    date_end = args.dateEnd
    list_date = args.listDate

    list_date = list_date.split(' ') if list_date is not None else None

    # -- Format the date
    datetime_format = '%Y-%m-%d'
    datetime_format_UTC = '%Y-%m-%dT%H:%M:%SUTC'

    freeze_support()
    
    # username = input('Username:')
    # password = getpass.getpass('Password:')
    
    user_pass_session = asf.ASFSession().auth_with_creds(username=username, password=password)

    # print(os.path.dirname(os.path.abspath(__file__)))
    current_path = os.path.dirname(os.path.abspath(__file__))
          
    # print(os.path.abspath(os.path.join(current_path, '../../images/imagesZIP')))
    images_zip_path = os.path.abspath(os.path.join(current_path, '../../images/imagesZIP'))

    results_with_zips = []

    # Check if list date is provided
    if list_date is not None:
        print(list_date)
        for date in list_date:
            print(date)
            print(datetime.strptime(date, datetime_format) + timedelta(days=1))

            result_date_zip = asf.search(
                intersectsWith=polygon,
                platform=asf.PLATFORM.SENTINEL1,
                processingLevel=asf.PRODUCT_TYPE.GRD_HD,
                start=datetime.strptime(date, datetime_format),
                end=datetime.strptime(date, datetime_format) + timedelta(days=1))
            
            # print(type(result_date_zip))
            # print(result_date_zip[0].properties)

            results_with_zips.append(result_date_zip[0].properties)
            # results_with_zips.append(result_date_zip[0]["features"][0])
            
    else:
        results_with_zips = asf.search(
            intersectsWith=polygon,
            platform=asf.PLATFORM.SENTINEL1,
            processingLevel=asf.PRODUCT_TYPE.GRD_HD,
            start=datetime.strptime(date_start, datetime_format),
            end=datetime.strptime(date_end, datetime_format))
    
    # results_with_zips[0:1].download(path='./downloads7', session=user_pass_session)
    
    # print(results_with_zips)
        
    list_path_images_zip = []

    for result_zip in tqdm(results_with_zips):
        # print("--------------------------------------------------------------------")
        # print(result_zip)

        # Get date with good format 
        date_folder = result_zip.properties["processingDate"].split("T")[0].replace('-', '_') if list_date is None else result_zip["processingDate"].split("T")[0].replace('-', '_')
        file_name = result_zip.properties["fileName"] if list_date is None else result_zip["fileName"]
        # print(dateFolder)

        # Check if file is already downloaded
        if os.path.exists(f'{images_zip_path}/{date_folder}/{file_name}'):
            list_path_images_zip.append(f'{images_zip_path}/{date_folder}/{file_name}')
            
        else:
            # Create folder if not exist
            if not os.path.exists(f'{images_zip_path}/{date_folder}'):
                os.makedirs(f'{images_zip_path}/{date_folder}')    

            # print(f'Downloading {file_name}...')
            list_path_images_zip.append(f'{images_zip_path}/{date_folder}/{file_name}')
            result_zip.download(path=f'{images_zip_path}/{date_folder}', session=user_pass_session)


    print(list_path_images_zip)
        
