import os
from tqdm import tqdm
import argparse

if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='Download image data in .zip format from ASF')

    # Processor Arguments
    parser.add_argument('--listPathFilesZip', help='List absolute path of .ZIP to process', required=True)
    parser.add_argument('--pathGpt', help='End of the period you want download with format YYYY-MM-DD', required=True)
    # parser.add_argument('--pathGraph', help='Absolute Path to directory where the graph .xml is', required=True)
    # parser.add_argument('--outputPathTif', help='Absolute Path to directory where the files .tif will be saved after the process', required=True)
    parser.add_argument('--polygon', help='Polygon you want images from', required=True)

    # Analyser Arguments
    args = parser.parse_args()

    # Processor Arguments
    list_files_zip = args.listPathFilesZip
    path_gpt = args.pathGpt
    polygon = args.polygon

    # PATH TO GRAPH
    current_path = os.path.dirname(os.path.abspath(__file__))
    path_graph = os.path.abspath(os.path.join(current_path, '../finalGraph.xml'))

    # GET THE LIST OF FILES ZIP
    list_files_zip = list_files_zip.split(' ')

    # OUPTUT PATH TIF
    output_path_tif = os.path.abspath(os.path.join(current_path, '../../images/imagesTIF/'))

    # POLYGON FOLDER 
    polygon_folder_name = polygon.lower().replace(" ", "_")

    # Create the output folder if not created
    if not os.path.exists(f'{output_path_tif}/{polygon_folder_name}'):
        os.mkdir(f'{output_path_tif}/{polygon_folder_name}')

    # Initialize the dictionnary
    params = {}

    grandPolygon = polygon

    # transformer le polygon en liste de float
    grandPolygon = grandPolygon.replace("POLYGON((", "").replace("))", "").replace(",", " ").split(" ")
    grandPolygon = [float(x) for x in grandPolygon]

    # mettre par couple de deux valeurs sous forme de liste
    grandPolygon = [[grandPolygon[i], grandPolygon[i + 1]] for i in range(0, len(grandPolygon), 2)]
    # %%
    grandPolygon[0][0] = grandPolygon[0][0] - 0.1
    grandPolygon[0][1] = grandPolygon[0][1] - 0.1

    grandPolygon[1][0] = grandPolygon[1][0] + 0.1
    grandPolygon[1][1] = grandPolygon[1][1] - 0.1

    grandPolygon[2][0] = grandPolygon[2][0] + 0.1
    grandPolygon[2][1] = grandPolygon[2][1] + 0.1

    grandPolygon[3][0] = grandPolygon[3][0] - 0.1
    grandPolygon[3][1] = grandPolygon[3][1] + 0.1

    grandPolygon[4][0] = grandPolygon[0][0]
    grandPolygon[4][1] = grandPolygon[0][1]


    # reformer le polygon de base avec ces nouvelles valeurs
    grandPolygon = "POLYGON((" + ", ".join([str(x[0]) + " " + str(x[1]) for x in grandPolygon]) + "))"


    # Apply the graph on each image
    for absolute_path_file in tqdm(list_files_zip):
        file_name = os.path.basename(absolute_path_file)

        # If the file is not already processed
        if not os.path.exists(f'{output_path_tif}/{polygon_folder_name}/{file_name.replace(".zip", ".tif")}'):
        # Set the parameters for the current file
            params["inputFile"] = absolute_path_file
            params["outputFile"] = "\"" + output_path_tif + "/" + polygon_folder_name + "/" + file_name.replace(".zip", ".tif")  + "\"" 
            params["polygon1"] = "\"" + grandPolygon + "\""
            params["polygon2"] = "\"" + polygon + "\""

            # Construct the optionnal parameter command line
            paramLine = ""
            for k in params.keys():
                paramLine += f" -P{k}={params[k]}"

            # Run the executable
            # print(f"{snapExecutablePath} {orthoGraph} {paramLine}")
            os.system(f"{path_gpt} {path_graph} {paramLine}")
