// Format of data
// Line 1: (tags): tag1:tag2:tag3
// Line 2 - N: (data): <x_value>;<y_value_1>,<y_value_2>,<y_value_3>

var AXIS_DELIM = ";";
var YDATA_DELIM = ",";
var TAGS_DELIM = ":";

// Parse a CSV for data
function ParseCSV(file, callback)
{
    var parseData = function(lines)
    {
        var data = [];
        
        // Parse first line for tags
        var firstLine = lines[0];
        var tags = firstLine.split(TAGS_DELIM);

        // Parse rest of the lines for data
        var lineNumber = 1;
        while (lineNumber < lines.length)
        {
            var line = lines[lineNumber];
            var lineData = line.split(AXIS_DELIM);
            var point = {};
            var yData = lineData[1].split(YDATA_DELIM);

            // X Data
            point.x = parseInt(lineData[0]);
            
            // Parse y data
            var index = 0;
            point.y = {};
            while (index < tags.length)
            {
                point.y[tags[index]] = parseInt(yData[index]);
                index++;
            }

            data.push(point);
            lineNumber++;
        }

        callback(data, tags);
    };

    ReadFile(file, parseData)
}

// Read data from a file
function ReadFile(file, callback)
{
    // Setup file reader
    var fileReader = new FileReader();
    fileReader.onload = function(arg)
    {
        var text = arg.target.result;
        var lines = text.split(/\r\n|\n/);

        if (lines.length == 0)
        {
            alert("Empty file!");
        }
        else if (lines.length == 1)
        {
            alert("Incorrect file!");
        }
        else
        {
            callback(lines);
        }
    };

    fileReader.onerror = function(err)
    {
        alert(err.target.error.name);
    }
    
    // Issue a read
    fileReader.readAsText(file);
}