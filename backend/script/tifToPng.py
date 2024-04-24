import os
from tqdm import tqdm
import argparse
import cv2
import rioxarray
import numpy as np

if __name__ == '__main__':
    # Define the parser
    parser = argparse.ArgumentParser(description='Download image data in .zip format from ASF')

    # Processor Arguments
    parser.add_argument('--inputPathTif', help='Absolute Path to directory where the files .tif will be saved after the process', required=True)


    # Analyser Arguments
    args = parser.parse_args()

    # Processor Arguments
    input_path_tif = args.inputPathTif

    # Read images
    listFiles = [f for f in os.listdir(input_path_tif) if os.path.isfile(os.path.join(input_path_tif,f)) and f.endswith('.tif')]

    # Create folder png if not exist
    if not os.path.exists(f'{input_path_tif}/png'):
        os.makedirs(f'{input_path_tif}/png')


    # Process images to make png 
    for f in tqdm(listFiles):
        print(f)
        full_path = os.path.join(input_path_tif, f)
        im = rioxarray.open_rasterio(full_path).data

        im1 = im[0]

        # Calculer la moyenne et l'écart type
        mean1 = im1.mean()
        std1 = im1.std()

        # Limiter les valeurs à la moyenne +- 3*std
        im1 = np.clip(im1, mean1 - 3 * std1, mean1 + 3 * std1)

        # Normaliser les données de l'image à 0-1
        im_normalized1 = (im1 - np.min(im1)) / (np.max(im1) - np.min(im1))

        # Échelle à 0-255 et convertir en uint8
        im_scaled1 = (255 * im_normalized1).astype(np.uint8)

        # Écrire les données de l'image normalisées et mises à l'échelle dans un nouveau fichier
        if not os.path.exists(f'{input_path_tif}/png' + "/" + f.replace(".tif", "_VH.png")):
            cv2.imwrite(f'{input_path_tif}/png' + "/" + f.replace(".tif", "_VH.png"), im_scaled1)

        im2 = im[1]

        # Calculer la moyenne et l'écart type
        mean2 = im2.mean()
        std2 = im2.std()

        # Limiter les valeurs à la moyenne +- 3*std
        im2 = np.clip(im2, mean2 - 3 * std2, mean2 + 3 * std2)

        # Normaliser les données de l'image à 0-1
        im_normalized2 = (im2 - np.min(im2)) / (np.max(im2) - np.min(im2))

        # Échelle à 0-255 et convertir en uint8
        im_scaled2 = (255 * im_normalized2).astype(np.uint8)

        # Écrire les données de l'image normalisées et mises à l'échelle dans un nouveau fichier
        if not os.path.exists(f'{input_path_tif}/png' + "/" + f.replace(".tif", "_VV.png")):
            cv2.imwrite(f'{input_path_tif}/png' + "/" + f.replace(".tif", "_VV.png"), im_scaled2)


