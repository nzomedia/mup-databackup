#!/bin/bash


#Backup meteor app data and settings.

PATHS=(<% for(var p in paths){ %> <%- paths[p] %> <% } %>)
DESTINATION=<%= destination %>

destinationFolder=$(echo $DESTINATION | sed "s/\/$//")/$(date +"%Y-%m-%d_%H-%M-%S")
echo "Creating destination folder ($destinationFolder)..."
if [[ -d $destinationFolder ]]
then
	echo Destination folder already exists. Renaming to previous...
	mv $destinationFolder $destinationFolder-previous	
fi

sudo mkdir -p $destinationFolder
sudo chown ${USER} $destinationFolder

echo "Ok"

echo

echo Paths to backup:
for p in ${PATHS[@]}
do
	echo $p
done
echo

set -e
printf "Processing:\n"

for i in ${!PATHS[@]}
do
	sourcePath=${PATHS[i]}
	if [[ -a $sourcePath ]]
	then
		destinationPath="$destinationFolder"/$(echo "$sourcePath" | sed "s/\//-/g" | sed "s/^-*//").tar
		printf "%-30s \t%s\t %-30s\n" $sourcePath "-->" $destinationPath
		tar --checkpoint=10 -cf "$destinationPath" "$sourcePath"
	else
		echo "Path $sourcePath do not exist, skipping it."
	fi
done
set +e



