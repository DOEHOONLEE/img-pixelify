## pixelify-image

It is a JS module for pixelify multiple images. This can also be used for creating/previewing arduino matrix LED which uses an array of color codes as input.

You can have a pixelified image saved on your computer OR see the converted color code data OR check out how the matrix LED will look like using terminal.

## Usage

#### Without Installation

* PLEASE keep in mind

  * BOTH "remote" and "local" path can be used with `--convert-data` && `--convert-preview`
  * ONLY "local" path can be used with `--convert-save`

* To save the result image (LOCAL)

```bash
# The path coming after "default" must be an absolute path and it MUST be local
# It will create an output image in the same path of the input image
# the output image will be named as 'original image name' + '_pixelified.png'

npx pixelify-image --convert-save default '/Users/doehoonlee/Documents/Projects/Personal/img-pixelify/examples/HEART.png'
```

<img width="793" alt="Screen Shot 2023-01-05 at 9 02 42 PM" src="https://user-images.githubusercontent.com/20305442/210776054-346218bc-ef9c-46ce-9169-7db0eb9b06d4.png">


* To get the color codes

```bash
# Below example uses a remote image
# When using an image in local, the path following after "default" must be an absolute path
# Converted color codes can be used as input for arduino matrix LED

npx pixelify-image --convert-data default 'https://raw.githubusercontent.com/DOEHOONLEE/img-pixelify/main/examples/HEART.png'
```

<img width="345" alt="convertData" src="https://user-images.githubusercontent.com/20305442/210776916-dbfdb27a-3a60-4ece-93b0-1b5fe8ce7c62.png">


* To see/preview of a pixelified image or how it will look like on arduino matrix LED

```bash
npx pixelify-image --convert-preview default 'https://raw.githubusercontent.com/DOEHOONLEE/img-pixelify/main/examples/HEART.png'

```

<img width="159" alt="Screen Shot 2023-01-05 at 9 05 00 PM" src="https://user-images.githubusercontent.com/20305442/210776481-adfb7b74-1953-4e93-93d2-c89ae9d8d844.png">
