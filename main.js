function plot(obj)
{
    var file = obj.files[0];
    var parseCallback = function(data, tags)
    {
        var marginInfo = {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
        };

        SetupLinePlot(marginInfo, data, tags);
    };
    
    ParseCSV(file, parseCallback);
};