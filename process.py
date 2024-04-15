import os
from tqdm import tqdm
import argparse

if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='Download image data in .zip format from ASF')

    # Processor Arguments
    parser.add_argument('--outputPathZip',
                        help='Absolute Path to directory where the downloaded files .zip will be saved', required=True)
    parser.add_argument('--pathGpt', help='End of the period you want download with format YYYY-MM-DD', required=True)
    parser.add_argument('--pathGraph', help='Absolute Path to directory where the graph .xml is', required=True)
    parser.add_argument('--outputPathTif', help='Absolute Path to directory where the files .tif will be saved after the process', required=True)
    parser.add_argument('--polygon', help='Polygon you want images from', required=True)

    # Analyser Arguments
    args = parser.parse_args()

    # Processor Arguments
    output_path_zip = args.outputPathZip
    path_gpt = args.pathGpt
    path_graph = args.pathGraph
    output_path_tif = args.outputPathTif
    polygon = args.polygon

    # Read images
    listFiles = [f for f in os.listdir(output_path_zip) if os.path.isfile(os.path.join(output_path_zip,f)) and f.endswith('.zip')]

    # Create the output folder if not created
    if not os.path.isdir(output_path_tif):
        os.mkdir(output_path_tif)

    # Initialize the dictionnary
    params = {}

    # polygon = "POLYGON ((6.546999931335449 45.98400115966797, 5.4710001945495605 45.98400115966797, 5.4710001945495605 45.64099884033203, 6.546999931335449 45.64099884033203, 6.546999931335449 45.98400115966797, 6.546999931335449 45.98400115966797))"
    # Apply the graph on each image
    for f in tqdm(listFiles):
        # Set the parameters for the current file
        params["inputFile"] = output_path_zip + f
        params["outputFile"] = output_path_tif + f.replace(".zip", ".tif")
        params["polygon"] = "\"" + polygon + "\""

        # Construct the optionnal parameter command line
        paramLine = ""
        for k in params.keys():
            paramLine += f" -P{k}={params[k]}"

        # Run the executable
        # print(f"{snapExecutablePath} {orthoGraph} {paramLine}")
        os.system(f"{path_gpt} {path_graph} {paramLine}")
