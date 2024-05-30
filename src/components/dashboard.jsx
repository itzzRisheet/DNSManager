import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  deleteHostedZones,
  deleteRecord,
  getHostedZones,
  getRecords,
} from "../helper/helper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCheck,
  faCross,
  faDeleteLeft,
  faDumpster,
  faEdit,
  faEraser,
  faPlus,
  faRefresh,
  faSignOut,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import LoadingList from "../animations/loading";
import { useData, useLocalStore } from "../store/store";
import AddHostedZoneBox from "./AddHostedZoneBox";
import AddRecordBox from "./AddRecordBox";
import EditHostedZoneBox from "./editHostedZoneBox";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [hostedzones, sethostedzones] = useState([]);
  const [records, setrecords] = useState([]);
  const [currRecord, setCurrRecord] = useState({});
  const [currHostedZone, setCurrHostedZone] = useState({});
  const [selectedZones, setSelectedZones] = useState([]);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const {
    addHostedZoneOpen,
    setAddHostedZoneOpen,
    addRecordBoxOpen,
    setAddRecordBoxOpen,
    editHostedZoneBox,
    setEditHostedZoneBox,
  } = useLocalStore();
  const { updatedhostedZone, setUpdatedHostedZone } = useData();

  useEffect(() => {
    sethostedzones([...hostedzones, updatedhostedZone]);
  }, [updatedhostedZone]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        setAddHostedZoneOpen(false);
        setAddRecordBoxOpen(false);
        setEditHostedZoneBox(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const updateCurrentRecords = async (hostedZoneId) => {
    setRecordLoading(true);
    const id = hostedZoneId.split("/")[2];

    if (id in records) {
      await setCurrRecord(records[id]);
    } else {
      const { data } = (await getRecords(id)).data;
      await setrecords({
        ...records,
        [id]: data.ResourceRecordSets,
      });
      setCurrRecord(data.ResourceRecordSets);
    }
    setRecordLoading(false);
  };

  useGSAP(() => {
    gsap.fromTo(
      ".dashcard",
      { opacity: 0 },
      { opacity: 1, duration: 1.3, stagger: 0.5 }
    );

    gsap.to(".loading-row", {
      opacity: 0,
      yoyo: true,
      repeat: -1,
      duration: 0.5,
      ease: "power1.inOut",
    });
  });
  const getData = async () => {
    const { HostedZones } = (await getHostedZones()).data.data;

    if (HostedZones.length > 0) {
      await updateCurrentRecords(HostedZones[0].Id);
      setCurrHostedZone(HostedZones[0]);
    }
    await sethostedzones(HostedZones);
    setZoneLoading(false);
  };

  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setZoneLoading(true);

    getData();
    const { username } = jwtDecode(localStorage.getItem("token"));
    setUsername(username);
  }, []);

  return (
    <div className="relative m-0 p-0">
      {addHostedZoneOpen ? (
        <div className="absolute h-screen w-screen z-50 backdrop-blur-md flex flex-col justify-center items-center">
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white absolute right-[2rem] text-lg sm:text-xl md:text-2xl top-[2rem] hover:scale-110 transition-all duration-150 cursor-pointer"
          />
          <AddHostedZoneBox />
        </div>
      ) : (
        ""
      )}
      {addRecordBoxOpen ? (
        <div className="absolute h-screen w-screen z-50 backdrop-blur-md  flex flex-col justify-center items-center">
          <AddRecordBox hostedzone={currHostedZone} />
        </div>
      ) : (
        ""
      )}
      {editHostedZoneBox ? (
        <div className="absolute h-screen w-screen z-50 backdrop-blur-md  flex flex-col justify-center items-center">
          <EditHostedZoneBox zone={currHostedZone} />
        </div>
      ) : (
        ""
      )}
      <div
        className={`h-screen w-screen flex flex-col items-center justify-center bg-main ${
          addHostedZoneOpen || addRecordBoxOpen || editHostedZoneBox
            ? "brightness-50"
            : ""
        }`}
      >
        <div className="absolute top-4 text-white"> Hello , {username}</div>
        <div
          className="absolute right-5 top-4 text-white text-lg cursor-pointer hover:scale-110 transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          {" "}
          <FontAwesomeIcon icon={faSignOut} />{" "}
        </div>
        <div className="h-5/6 w-5/6  flex flex-col gap-4 p-4 rounded-3xl">
          <div className="dashcard border-[0.4px] py-4 bg-dashcard overflow-auto border-gray-500  flex flex-col rounded-3xl">
            <div className="relative  w-full flex justify-between  items-center px-4 text-white font-bold text-xs md:text-sm">
              <span className="">Hosted zones</span>

              <div className="flex gap-3">
                <div
                  className={`flex gap-3 ${
                    selectedZones.length > 0 ? "block" : "hidden"
                  }`}
                >
                  <button
                    className={` md:bg-sky-900 md:px-4 py-1 font-semibold rounded-xl md:hover:bg-sky-950 transition-all duration-200 ${
                      selectedZones.length !== 1 ? "hidden" : "block"
                    } `}
                    onClick={() => {
                      setEditHostedZoneBox(true);
                    }}
                  >
                    <span className="block md:hidden">
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span className={`hidden md:block`}>Edit</span>
                  </button>
                  <button
                    className={` md:bg-sky-900 md:px-4 py-1 font-semibold rounded-xl md:hover:bg-sky-950 transition-all duration-200 `}
                    onClick={async (e) => {
                      e.preventDefault();
                      const { data, status } = await deleteHostedZones(
                        selectedZones
                      );
                      if (status === 200) {
                        sethostedzones((prevHostedZones) =>
                          prevHostedZones.filter(
                            (zone) => !selectedZones.includes(zone.Id)
                          )
                        );
                        setSelectedZones([]);
                        setCurrRecord([]);
                      }
                    }}
                  >
                    <span className="block md:hidden">
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span className={`hidden md:block`}>Delete</span>
                  </button>
                </div>
                <button
                  className={` md:bg-sky-900 md:px-4 py-1 font-semibold rounded-xl md:hover:bg-sky-950 transition-all duration-200 `}
                  onClick={() => {
                    setAddHostedZoneOpen(true);
                  }}
                >
                  <span className="block md:hidden">
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  <span className={`hidden md:block`}>Add Hostedzone</span>
                </button>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    setZoneLoading(true);
                    await getData();
                    setZoneLoading(false);
                  }}
                >
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
              </div>
            </div>
            <div className="container mx-auto p-4 ">
              <div className="overflow-x-auto ">
                <table className=" min-w-full  text-xs md:text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-tablehead text-white font-bold">
                      <th className="border border-gray-300 p-2">
                        <FontAwesomeIcon icon={faCheck} />
                      </th>
                      <th className="border border-gray-300 p-2">Name</th>
                      <th className="border border-gray-300 p-2">Type</th>
                      <th className="border border-gray-300 p-2">Records</th>
                      <th className="border border-gray-300 p-2">
                        Description
                      </th>
                    </tr>
                  </thead>

                  {hostedzones.length > 0 && !zoneLoading && (
                    <tbody>
                      {hostedzones.map((zone, index) => (
                        <tr
                          key={index}
                          className={` text-white cursor-pointer hover:bg-gray-600 ${
                            zone.Id === (currHostedZone?.Id || "")
                              ? "bg-gray-800"
                              : "bg-tablerow"
                          }`}
                          onClick={async () => {
                            setCurrRecord([]);
                            setCurrHostedZone(zone);
                            updateCurrentRecords(zone.Id);

                            console.log("current record :", currRecord);
                          }}
                        >
                          <td
                            className={`border border-gray-300 p-2 text-center ${
                              selectedZones.includes(zone.Id)
                                ? "bg-gray-800"
                                : ""
                            } hover:bg-gray-800`}
                            onClick={(e) => {
                              if (selectedZones.includes(zone.Id)) {
                                setSelectedZones(
                                  selectedZones.filter((id) => id !== zone.Id)
                                );
                              } else {
                                setSelectedZones([...selectedZones, zone.Id]);
                              }
                              console.log(selectedZones);
                            }}
                          >
                            {selectedZones.includes(zone.Id) ? (
                              <FontAwesomeIcon icon={faCheck} />
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {zone.Name}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {zone.Config.PrivateZone ? "Private" : "Public"}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {zone.ResourceRecordSetCount}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {zone.Config.Comment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
                {zoneLoading && (
                  <div className="p-3 w-full  flex justify-center">
                    <LoadingList />
                  </div>
                )}
                {!hostedzones.length && !zoneLoading && (
                  <div className="text-white w-full  text-center ">
                    No zones found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="dashcard border-[0.2px] bg-dashcard border-gray-500 flex flex-col rounded-3xl">
            <div className="container mx-auto overflow-auto py-3">
              <div className="relative  w-full flex justify-between items-center px-4 text-white font-bold text-xs md:text-sm">
                <div className="text-white font-bold text-xs md:text-sm ">
                  DNS Records{" "}
                  {Object.keys(currHostedZone ?? {}).length === 0
                    ? ""
                    : `for ${currHostedZone.Name}`}
                </div>
                <div className="flex gap-3">
                  <div
                    className={`flex gap-3 ${
                      selectedRecord !== undefined ? "block" : "hidden"
                    }`}
                  >
                    <button
                      className={` md:bg-sky-900 md:px-4 py-1 font-semibold rounded-xl md:hover:bg-sky-950 transition-all duration-200 `}
                      onClick={async () => {
                        const record = currRecord[selectedRecord];
                        if (record.Type === "NS" || record.Type === "SOA") {
                          console.log("Default records can't be deleted!!!");
                          return;
                        }
                        const changes = [
                          {
                            Action: "DELETE", // Use 'CREATE', 'DELETE', or 'UPSERT'
                            ResourceRecordSet: record,
                          },
                        ];
                        console.log(record);

                        const { data, status } = await deleteRecord(
                          currHostedZone.Id,
                          changes
                        );

                        if (status === 200) {
                          setCurrRecord((prev) =>
                            prev.filter(
                              (record, index) => index !== selectedRecord
                            )
                          );
                        }
                      }}
                    >
                      <span className="block md:hidden">
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                      <span className={`hidden md:block`}>Delete</span>
                    </button>
                  </div>
                  <button
                    className={` md:bg-sky-900 md:px-4 py-1 font-semibold rounded-xl md:hover:bg-sky-950 transition-all duration-200 `}
                    onClick={() => {
                      setAddRecordBoxOpen(true);
                    }}
                  >
                    <span className="block md:hidden">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <span className={`hidden md:block`}>Add Record</span>
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      setZoneLoading(true);
                      await getData();
                      setZoneLoading(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faRefresh} />
                  </button>
                </div>
              </div>

              <div className="container mx-auto p-4">
                <div className=" ns overflow-x-auto">
                  <table className="min-w-full  text-xs md:text-sm border-collapse border text-white border-gray-300">
                    <thead>
                      <tr className="bg-tablehead font-bold">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Type</th>
                        <th className="border border-gray-300 p-2">TTL</th>
                        <th className="border border-gray-300 p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currRecord &&
                        !recordLoading &&
                        currRecord.length > 0 &&
                        currRecord.map((record, index) => (
                          <tr
                            key={index}
                            className={`${
                              index === selectedRecord
                                ? "bg-gray-800"
                                : "bg-tablerow"
                            }`}
                            onClick={() => {
                              if (index === selectedRecord) {
                                setSelectedRecord(undefined);
                              } else {
                                setSelectedRecord(index);
                              }
                            }}
                          >
                            <td className="border border-gray-300 p-2">
                              {record.Name}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {record.Type}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {record.TTL}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {record.ResourceRecords[0].Value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {recordLoading && (
                    <div className="p-3 w-full  flex justify-center">
                      <LoadingList />
                    </div>
                  )}
                  {!currRecord.length && !recordLoading && !zoneLoading && (
                    <div className="text-white w-full  text-center ">
                      No records found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
