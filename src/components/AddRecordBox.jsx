import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { createRecord } from "../helper/helper";
import { useData } from "../store/store";
const RecordTypes = [
  "A",
  "AAAA",
  "CAA",
  "CNAME",
  "DS",
  "MX",
  "NAPTR",
  "NS",
  "PTR",
  "SOA",
  "SPF",
  "SRV",
  "TXT",
];

const AddRecordBox = ({ hostedzone }) => {
  const [credentials, setCredentials] = useState({
    Name: "",
    Type: "A",
    Value: "",
    TTL: 300,
  });

  const [errors, setErrors] = useState({});

  const validateRecordname = (recordname) => {
    let newErrors = {};

    if (!recordname.trim()) {
      newErrors.recordName = "Please enter a record name";
    } else {
      const labels = recordname.split(".");

      for (let label of labels) {
        if (!/^[a-zA-Z0-9-]+$/.test(label)) {
          newErrors.recordName = "Special characters or spaces are not allowed";
        }

        if (label.startsWith("-") || label.endsWith("-")) {
          newErrors.recordName = "Record name cannot start or end with '-'";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length > 0;
  };

  const validateValue = (value) => {
    const regx =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    setErrors((prev) => ({ ...prev, ipv4: "Invalid IPv4 Address!!!" }));
    return regx.test(value);
  };

  const handleSubmit = async () => {
    let name = `${credentials.Name}.${hostedzone.Name}`;
    name = name.trim();

    if (!validateRecordname(name) || !validateValue) {
      return;
    }

    const changes = [
      {
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: name,
          Type: credentials.Type,
          TTL: credentials.TTL,
          ResourceRecords: [
            {
              Value: credentials.Value,
            },
          ],
        },
      },
    ];

    const { data, status } = await createRecord(hostedzone.Id, changes);
    if (status === 200) {
      setAddRecordBoxOpen(false);
    }
  };

  return (
    <div className="min-h-2/5 w-3/5 bc flex flex-col px-4 py-5">
      <div className="flex flex-col   md:flex-row justify-between">
        <div className="w-full md:w-2/5 flex flex-col ">
          <label
            className="font-semibold text-sm text-gray-300 pb-1 block"
            htmlFor="Record name"
          >
            Record name
          </label>
          <input
            className={` text-white  bg-transparent border rounded-lg px-3 py-2 mt-1  text-sm w-full ${
              errors.recordName ? "border-red-500 border-2" : ""
            }`}
            type="text"
            id="Record name"
            onChange={(e) => {
              setCredentials((prev) => ({ ...prev, Name: e.target.value }));
            }}
          />
          {errors.recordName && (
            <p className="text-red-500">{errors.recordName}</p>
          )}
        </div>
        <div className="w-full md:w-2/5">
          <label
            className="font-semibold text-sm text-gray-300 pb-1 block"
            htmlFor="Type"
          >
            Select Record Type
          </label>
          <select
            className="text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none"
            id="Type"
            onChange={(e) => {
              setCredentials((prev) => ({ ...prev, Type: e.target.value }));
            }}
          >
            {RecordTypes.map((record) => (
              <option
                className="bg-slate-600 text-white"
                key={record}
                value={record}
                style={{
                  appearance: "none",
                }}
              >
                {record}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          className="font-semibold text-sm text-gray-300 pb-1 block"
          htmlFor="value"
        >
          value
        </label>
        <input
          className={`text-white border bg-transparent rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full ${
            errors.ipv4 ? "border-red-500 border-2" : ""
          }`}
          type="text"
          id="TTL"
          placeholder="192.0.2.235"
          onChange={(e) => {
            setCredentials((prev) => ({ ...prev, Value: e.target.value }));
          }}
        />
        {errors.value && <p>{errors.ipv4}</p>}
      </div>
      <div className="flex items-center gap-2 justify-start">
        <div className="w-2/5">
          <label
            className="font-semibold text-sm text-gray-300 pb-1 block"
            htmlFor="TTL"
          >
            TTL (seconds)
          </label>
          <input
            className=" text-white border bg-transparent rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            type="number"
            id="TTL"
            value={credentials.TTL}
            onChange={(e) => {
              setCredentials((prev) => ({ ...prev, TTL: e.target.value }));
            }}
          />
        </div>
      </div>
      <div className="flex w-full justify-end ">
        <button
          className="text-sm py-1 px-2 md:py-2 md:px-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-all duration-150"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddRecordBox;
