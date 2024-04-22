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


    # -- Format the date
    datetime_format = '%Y-%m-%d'
    datetime_format_UTC = '%Y-%m-%dT%H:%M:%SUTC'

    freeze_support()
    
    # username = input('Username:')
    # password = getpass.getpass('Password:')
    
    user_pass_session = asf.ASFSession().auth_with_creds(username=username, password=password)

    current_path = os.path.dirname(os.path.abspath(__file__))
          
    images_zip_path = os.path.abspath(os.path.join(current_path, '../../images/imagesZIP'))

    results_with_zips = []


    results_with_zips = asf.search(
        intersectsWith=polygon,
        platform=asf.PLATFORM.SENTINEL1,
        processingLevel=asf.PRODUCT_TYPE.GRD_HD,
        start=datetime.strptime(date_start, datetime_format),
        end=datetime.strptime(date_end, datetime_format))
    
    # results_with_zips[0:1].download(path='./downloads7', session=user_pass_session)
    
        
    list_path_images_zip = []


    for result_zip in tqdm(results_with_zips):

        # Get date with good format 
        date_folder = result_zip.properties["processingDate"].split("T")[0].replace('-', '_') 
        file_name = result_zip.properties["fileName"]
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
        





# [
#     {'centerLat': 44.8302, 
#      'centerLon': -2.1909, 
#      'stopTime': '2024-04-09T06:17:39Z', 
#      'fileID': 'S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593-GRD_HD', 
#      'flightDirection': 'DESCENDING', 
#      'pathNumber': 81, 
#      'processingLevel': 'GRD_HD', 
#      'url': 'https://datapool.asf.alaska.edu/GRD_HD/SA/S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593.zip', 
#      'startTime': '2024-04-09T06:17:14Z', 
#      'sceneName': 'S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593', 
#      'browse': ['https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593.jpg'], 
#      'platform': 'Sentinel-1A', 'bytes': 1775632696, 'md5sum': '1652bf05c33dd20ff334cf38a46a200d', 
#      'frameNumber': 443, 
#      'granuleType': 'SENTINEL_1A_FRAME', 
#      'orbit': 53353, 
#      'polarization': 'VV+VH', 
#      'processingDate': '2024-04-09T06:17:14Z', 
#      'sensor': 'C-SAR', 
#      'groupID': 'S1A_IWDV_0442_0449_053353_081', 
#      'pgeVersion': '003.71', 
#      'fileName': 'S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593.zip', 
#      'beamModeType': 'IW', 
#      's3Urls': ['s3://asf-ngap2w-p-s1-grd-7d1b4348/S1A_IW_GRDH_1SDV_20240409T061714_20240409T061739_053353_06783E_E593.zip']
#      }, 
#      {'centerLat': 44.7092, 
#       'centerLon': -0.1665, 'stopTime': '2024-03-11T06:09:26Z', 'fileID': 'S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351-GRD_HD', 'flightDirection': 'DESCENDING', 'pathNumber': 8, 'processingLevel': 'GRD_HD', 'url': 'https://datapool.asf.alaska.edu/GRD_HD/SA/S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351.zip', 'startTime': '2024-03-11T06:09:01Z', 'sceneName': 'S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351', 'browse': ['https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351.jpg'], 'platform': 'Sentinel-1A', 'bytes': 1775752226, 'md5sum': '2d842b0122840f8af85ab7cc2404b663', 'frameNumber': 443, 'granuleType': 'SENTINEL_1A_FRAME', 'orbit': 52930, 'polarization': 'VV+VH', 'processingDate': '2024-03-11T06:09:01Z', 'sensor': 'C-SAR', 'groupID': 'S1A_IWDV_0443_0449_052930_008', 'pgeVersion': '003.71', 'fileName': 'S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351.zip', 'beamModeType': 'IW', 's3Urls': ['s3://asf-ngap2w-p-s1-grd-7d1b4348/S1A_IW_GRDH_1SDV_20240311T060901_20240311T060926_052930_066827_1351.zip']                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
#      }
# ]

# [
#     {'centerLat': 46.3827, 
#      'centerLon': 7.2605, 
#      'stopTime': '2023-03-22T17:24:09Z', 
#      'fileID': 'S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF-GRD_HD', 
#      'flightDirection': 'ASCENDING', 
#      'pathNumber': 88, 
#      'processingLevel': 'GRD_HD', 
#      'url': 'https://datapool.asf.alaska.edu/GRD_HD/SA/S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF.zip', 
#      'startTime': '2023-03-22T17:23:44Z', 'sceneName': 'S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF', 
#      'browse': ['https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF.jpg'], 
#      'platform': 'Sentinel-1A', 
#      'bytes': 1028732518, 
#      'md5sum': 'e9cef578a7458ddd86bf6b4f6fc68e0a', 
#      'frameNumber': 148, 
#      'granuleType': 'SENTINEL_1A_FRAME', 
#      'orbit': 47760, 
#      'polarization': 'VV+VH', 
#      'processingDate': '2023-03-22T17:23:44Z', 
#      'sensor': 'C-SAR', 
#      'groupID': 'S1A_IWDV_0147_0154_047760_088', 
#      'pgeVersion': '003.52', 
#      'fileName': 'S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF.zip', 
#      'beamModeType': 'IW', 
#      's3Urls': ['s3://asf-ngap2w-p-s1-grd-7d1b4348/S1A_IW_GRDH_1SDV_20230322T172344_20230322T172409_047760_05BCD3_ADFF.zip']
#      }, 
#      {'centerLat': 45.9295, 'centerLon': 5.3097, 'stopTime': '2023-03-15T17:32:15Z', 'fileID': 'S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A-GRD_HD', 'flightDirection': 'ASCENDING', 'pathNumber': 161, 'processingLevel': 'GRD_HD', 'url': 'https://datapool.asf.alaska.edu/GRD_HD/SA/S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A.zip', 'startTime': '2023-03-15T17:31:50Z', 'sceneName': 'S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A', 'browse': ['https://datapool.asf.alaska.edu/BROWSE/SA/S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A.jpg'], 'platform': 'Sentinel-1A', 'bytes': 1021280501, 'md5sum': 'd9e6980a08d03d9b4be0cbbb045cca9c', 'frameNumber': 146, 'granuleType': 'SENTINEL_1A_FRAME', 'orbit': 47658, 'polarization': 'VV+VH', 'processingDate': '2023-03-15T17:31:50Z', 'sensor': 'C-SAR', 'groupID': 'S1A_IWDV_0146_0151_047658_161', 'pgeVersion': '003.52', 'fileName': 'S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A.zip', 'beamModeType': 'IW', 's3Urls': ['s3://asf-ngap2w-p-s1-grd-7d1b4348/S1A_IW_GRDH_1SDV_20230315T173150_20230315T173215_047658_05B960_848A.zip']}]