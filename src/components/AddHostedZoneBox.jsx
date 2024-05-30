import React, { useEffect, useState } from "react";
import { createHostedZone, getRegions, getVpcId } from "../helper/helper";
import { useData, useLocalStore } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "./DragAndDrop";

const regions = [
  "ap-south-1",
  "eu-north-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "sa-east-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
];

const AddHostedZoneBox = () => {
  const { updatedhostedZone, setUpdatedHostedZone } = useData();
  const { setAddHostedZoneOpen } = useLocalStore();
  const [vpcIds, setVpcIds] = useState([]);

  const [credentials, setCredentials] = useState({
    domainName: "",
    desc: "",
    privateZone: false,
    vpcRegion: "",
    vpcID: "",
  });

  useEffect(() => {
    const getdata = async () => {
      const { data } = await getVpcId(credentials.vpcRegion);
      setVpcIds(data.data);
    };
    getdata();
  }, [credentials.vpcRegion]);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const newErrors = {};

    if (!credentials.domainName) {
      newErrors.domainName = "Domain name is required";
    } else {
      const validCharsRegex = /^[a-z0-9!"#$%&'()*+,\-/:;<=>?@[\\\]^_`{|}~.]+$/i;
      const endsWithComRegex = /\.com$/;

      if (!endsWithComRegex.test(credentials.domainName)) {
        newErrors.domainName = "Domain name must end with .com";
      }

      if (!validCharsRegex.test(credentials.domainName)) {
        newErrors.domainName = "Domain name contains invalid characters";
      }
    }

    setErrors(newErrors);

    if (!errors.domainName) {
      const { data, status } = await createHostedZone({
        domainName: credentials.domainName,
        description: credentials.desc,
        privateZone: credentials.privateZone,
        vpcRegion : credentials.vpcRegion,
        vpcId : credentials.vpcID
      });

      if (status === 200) {
        setUpdatedHostedZone(data.data);
        setAddHostedZoneOpen(false);
        setCredentials({ domainName: "", desc: "" });
      }
    }
  };

  return (
    <div className="min-h-2/5 w-3/5 gap-[1rem] bc flex flex-col items-center py-5">
      <div className="w-5/6">
        <label
          className="font-semibold text-sm text-gray-300 pb-1 block"
          htmlFor="domainName"
        >
          Domain name
        </label>
        <input
          className={`text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none ${
            errors.domainName ? "border-red-700" : "border"
          }`}
          type="text"
          id="domainName"
          placeholder="example.com"
          value={credentials.domainName}
          onChange={(e) => {
            setCredentials({ ...credentials, domainName: e.target.value });
          }}
        />
        {errors.domainName && (
          <p className="text-red-500 text-sm">{errors.domainName}</p>
        )}
      </div>
      <div className="w-5/6">
        <label
          className="font-semibold text-sm text-gray-300 pb-1 block"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className=" text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none"
          id="description"
          value={credentials.desc}
          onChange={(e) => {
            setCredentials({ ...credentials, desc: e.target.value });
          }}
        ></textarea>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="text-sm flex  justify-between gap-2 rounded-lg p-2 md:p-3 lg:p-5 text-white font-semibold cursor-pointer hover:bg-slate-800 transition-all duration-150 bg-slate-700"
          onClick={() => {
            setCredentials((prev) => ({
              ...prev,
              privateZone: false,
            }));
          }}
        >
          <span
            className={`${!credentials.privateZone ? "visible" : "invisible"}`}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
          Public Zone
        </div>
        <div
          className="text-sm flex justify-between gap-2 rounded-lg p-2 md:p-3 lg:p-5 text-white font-semibold cursor-pointer hover:bg-slate-800 transition-all duration-150 bg-slate-700"
          onClick={async () => {
            setCredentials((prev) => ({
              ...prev,
              privateZone: true,
            }));
          }}
        >
          <span
            className={`${credentials.privateZone ? "visible" : "invisible"}`}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
          Private Zone
        </div>
      </div>
      {credentials.privateZone && (
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <select
              className="text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none"
              id="vpcRegion"
              onChange={(e) => {
                console.log(e.target.value);
                setCredentials((prev) => ({
                  ...prev,
                  vpcRegion: e.target.value,
                }));
              }}
            >
              <option value="" className="bg-slate-900 text-white font-bold">
                Select a region
              </option>
              {regions.map((region) => (
                <option
                  className="bg-slate-600 text-black"
                  key={region}
                  value={region}
                  style={{
                    appearance: "none",
                  }}
                >
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none"
              id="vpcIds"
              onChange={(e) => {
                setCredentials({ ...credentials, vpcID: e.target.value });
              }}
            >
              <option value="" className="bg-slate-900 text-white font-bold">
                Select VPC-id
              </option>
              {vpcIds.map((id) => (
                <option
                  className="bg-slate-600 text-black"
                  key={id}
                  value={id}
                  style={{
                    appearance: "none",
                  }}
                >
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="flex w-full justify-end px-4">
        <button
          className="text-sm py-1 px-2 md:py-2 md:px-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-all duration-150"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div className="flex gap-2 w-full items-center">
        {" "}
        <hr className="bg-gray-400 w-full" />
        <span className="text-white font-bold">OR</span>
        <hr className="bg-gray-400 w-full" />
      </div>
      <DragAndDrop />
    </div>
  );
};

export default AddHostedZoneBox;
