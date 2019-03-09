import React from 'react';

const App = () => {
  let fileReader;
  let modifyFileArray = [];

  const handleFileRead = e => {
    const fileData = fileReader.result;
    const splitFileData = fileData.split("\n");

    splitFileData.forEach(row => {
      let arrayString = trasformData(row);
      modifyFileArray.push(arrayString);
    });
    
    if (modifyFileArray != "") {
      let button = document.getElementById("download");
      button.classList.add("downloadLink");
    }
  };
  const extractDate = dateString => {
    const rex = /^([0-9]{4}\-(\d{2})\-(\d{2}))/;
    return dateString.match(rex)[0];
  };
  const trasformData = row => {
    const date = extractDate(row);
    console.log(date);
    const user = row
      .replace(extractDate(row), "")
      .trim()
      .split("         ");
    return {
      "Birth Date": date.toString().split("-").reverse().join("/"),
      "First Name": user[0],
      "last name": user[1],
      weight: user[2]
    };
  };
  const handleFileChosen = file => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  const convertCSVFile = args => {
    let result, ctr, keys, columndata, linedata, data;
    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }
    columndata = args.columndata || ",";
    linedata = args.linedata || "\n";

    keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columndata);
    result += linedata;

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columndata;
        
        result += item[key];
        ctr++;
      });
      result += linedata;
    });
    console.log('date:, ', result);
    return result;
  };
  const downloadCSVFile = args => {
    console.log("hello", JSON.stringify(modifyFileArray));
    let data, filename, downloadLink;

    let csv = convertCSVFile({
      data: modifyFileArray
    });
    if (csv == null) return;

    filename = args.filename || "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = "data:text/csv;charset=utf-8," + csv;
    }
    data = encodeURI(csv);

    downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", data);
    downloadLink.setAttribute("download", filename);
    downloadLink.click();
  };
    return (
      <div className="App">
        <h1>Data File convert to CSV file</h1>
        <div className="upload-expense">
          <input
            type="file"
            id="file"
            className="input-file"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
      
        </div>
          <a href={'#'} id="download" onClick={e => downloadCSVFile({ filename: "user-data.csv" })}>
              convert and Download CSV
          </a>
        </div>
    );
}


export default App;
