import os
from tqdm import tqdm
import argparse
import cv2
import rioxarray
import numpy as np
import json


def convert_floats(data):
    if isinstance(data, dict):
        return {k: convert_floats(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_floats(i) for i in data]
    elif isinstance(data, np.float32):
        return float(data)
    else:
        return data


if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='')

    # Processor Arguments
    parser.add_argument('--listeDates', help='', required=True)
    parser.add_argument('--outputPathJsonValue', help='', required=True)
    parser.add_argument('--outputPathPolygonFolder', help='', required=True)
    parser.add_argument('--coordinates', help='', required=True)

    # Analyser Arguments
    args = parser.parse_args()

    # Processor Arguments
    liste_dates = args.listeDates
    output_path_json_value = args.outputPathJsonValue
    output_path_polygon_folder = args.outputPathPolygonFolder
    coordinates = args.coordinates

    listFilesTif = [f for f in os.listdir(output_path_polygon_folder) if
                    os.path.isfile(os.path.join(output_path_polygon_folder, f)) and f.endswith('.tif')]

    print(listFilesTif)

    # retouner la liste
    listFilesTif.sort()

    liste_dates = liste_dates.split(" ")
    coordinates = coordinates.split(" ")

    result = {}
    listTifFinal = []
    i = 0
    for tif in listFilesTif:
        # split le nom du fichier par rapport au _,
        # ne garder que le 4eme élément
        # à l'intérieur que les 8 premiers caractères
        # mettre un "-" entre le caractère 4 et 5 et entre le caractère 6 et 7

        dateTif = tif.split("_")[4][:8][:4] + "-" + tif.split("_")[4][:8][4:6] + "-" + tif.split("_")[4][:8][6:8]

        if dateTif in liste_dates:
            listTifFinal.append(tif)

            absolutPath = os.path.join(output_path_polygon_folder, tif)

            # Charger l'image .tif avec rioxarray
            image = rioxarray.open_rasterio(absolutPath)

            # Accéder aux données d'amplitude
            amplitude = image.values

            result[dateTif] = {"sigma_VH": amplitude[0][int(coordinates[0])-1][int(coordinates[1])-1],
                               "sigma_VV": amplitude[1][int(coordinates[0])-1][int(coordinates[1])-1]}

    # Convert the 'result' dictionary
    result_converted = convert_floats(result)

    # Now you can dump the 'result_converted' dictionary into a JSON file
    with open(output_path_json_value + 'amplitudeValues.json', 'w') as json_file:
        json.dump(result_converted, json_file)
