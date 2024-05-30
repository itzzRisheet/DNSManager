import React, { useState } from "react";
import Papa from "papaparse";

const DragAndDrop = () => {
  const [files, setFiles] = useState([]);
  const [hostedZones, setHostedZones] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (fileList) => {
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        if (file.name.endsWith(".json")) {
          handleJSON(result);
        } else if (file.name.endsWith(".csv")) {
          handleCSV(result);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleJSON = (jsonString) => {
    try {
      const jsonData = JSON.parse(jsonString);
      const formattedHostedZones = jsonData.map((zone) => ({
        domainName: zone.domainName || "",
        description: zone.description || "",
        privateZone: !!zone.privateZone,
        vpcRegion: zone.vpcRegion || "",
        vpcId: zone.vpcId || "",
      }));
      setHostedZones((prevHostedZones) => [
        ...prevHostedZones,
        ...formattedHostedZones,
      ]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  
  const handleCSV = (csvString) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedHostedZones = result.data.map((row) => ({
          domainName: row.domainName || "",
          description: row.description || "",
          privateZone: !!row.privateZone,
          vpcRegion: row.vpcRegion || "",
          vpcId: row.vpcId || "",
        }));
        setHostedZones((prevHostedZones) => [
          ...prevHostedZones,
          ...formattedHostedZones,
        ]);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  return (
    <div
      className="border border-dashed flex flex-col h-full w-full justify-between border-gray-400 p-4 rounded-md text-white"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">Drag & Drop Files Here</h3>
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          Or click to browse
        </label>
        {hostedZones.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Parsed Hosted Zones:</p>
            <ul>
              {hostedZones.map((zone, index) => (
                <li key={index}>
                  Domain Name: {zone.domainName}, Description:{" "}
                  {zone.description}, Private Zone:{" "}
                  {zone.privateZone ? "Yes" : "No"}, VPC Region:{" "}
                  {zone.vpcRegion}, VPC ID: {zone.vpcId}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
