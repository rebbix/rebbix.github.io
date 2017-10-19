
while IFS='' read -r line || [[ -n "$line" ]]; do
    convert $line -resize 300 -quality 75 $line
done < "$1"