import axios from "axios";
import React, { useState } from "react";
import { useData, useLocalStore } from "../store/store";

const EditHostedZoneBox = ({ zone }) => {
  const { setUpdatedHostedZone } = useData();
  const { setEditHostedZoneBox } = useLocalStore();
  const [credentials, setCredentials] = useState({
    domainName: zone.Name,
    desc: zone.Config.Comment,
    privateZone: zone.Config.PrivateZone ? true : false,
    vpcRegion: "",
    vpcID: "",
  });

  const handleSubmit = async () => {
    const { data, status } = await axios.put(
      import.meta.env.VITE_BASEURL + `/hostedzones/${zone.Id.split("/")[2]}`,
      { Comment: credentials.desc }
    );
    if (status === 200) {
      setEditHostedZoneBox(false);
    }
  };

  return (
    <div className="bc h-4/5 w-2/5 flex flex-col gap-2 px-3 py-4 ">
      <div>
        <p className="text-gray-500 text-sm  font-bold">Domain name</p>
        <p className="text-gray-300">{zone.Name}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm  font-bold">HostedZone ID</p>
        <p className="text-gray-300">{zone.Id}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm  font-bold">Record count</p>
        <p className="text-gray-300">{zone.ResourceRecordSetCount}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm  font-bold">Type</p>
        <p className="text-gray-300">
          {zone.Config.PrivateZone ? "Private" : "Public"}
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-sm  font-bold">Description</p>
        <p className="text-gray-300">
          <textarea
            className=" text-white bg-transparent border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none"
            id="description"
            placeholder={zone.Config.Comment}
            onChange={(e) => {
              setCredentials((prev) => ({ ...prev, desc: e.target.value }));
            }}
          ></textarea>
        </p>
      </div>
      <div className="flex w-full justify-end px-4">
        <button
          className="text-sm py-1 px-2 md:py-2 md:px-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-all duration-150"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditHostedZoneBox;
