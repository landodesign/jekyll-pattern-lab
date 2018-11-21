Some new icons are added to this project.

To compile sprite for the new icons, this is the source directory

After generating sprite using gulp task we have to replace the content from

~\_sprite-icons-source\out\css\sprite.css

to this file

~\_scss\_sprite.scss

and the svg classes are being used with @extend in other scss file.

Also move the sprite image from

~\_sprite-icons-source\out\css\svg\{sprite image name is random}

to this directory

~\css\svg\



