DIRECTORY=./data
for i in $DIRECTORY/Grand*.csv; do
	echo $i 
	node csv_json.js "$i" < "$i.in"
    # Process $i
done
