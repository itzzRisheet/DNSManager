import axios from "axios";
import toast from "react-hot-toast";

export async function login(values) {
  try {
    let email, username, password;
    if (values.email) {
      email = values.email;
    } else if (values.username) {
      username = values.username;
    }
    password = values.password;

    const url = import.meta.env.VITE_BASEURL + "/login";
    console.log(url);
    const { data, status } = await axios.post(url, {
      email,
      username,
      password,
    });

    return { token: data.token, status, data };
  } catch (error) {
    throw error;
  }
}

export async function register(values) {
  try {
    const { data, status } = await axios.post(
      import.meta.env.VITE_BASEURL + "/register",
      values
    );

    return { token: data.token, status };
  } catch (error) {
    throw error;
  }
}

export async function getHostedZones() {
  try {
    const { data, status } = await axios.get(
      import.meta.env.VITE_BASEURL + "/domains"
    );
    return { data, status };
  } catch (error) {
    throw error;
  }
}

export async function createHostedZone(values) {
  try {
    const { data, status } = await axios.post(
      import.meta.env.VITE_BASEURL + "/hostedzones",
      values
    );

    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRegions() {
  try {
    const { data, status } = await axios.get(
      import.meta.env.VITE_BASEURL + "/regions"
    );

    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getVpcId(region) {
  try {
    const { data, status } = await axios.get(
      import.meta.env.VITE_BASEURL + "/vpcs/" + region.toString()
    );
    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecords(hostedZoneID) {
  try {
    const { data, status } = await axios.get(
      `${import.meta.env.VITE_BASEURL}/records/${hostedZoneID}`
    );
    console.log(data);
    return { data, status };
  } catch (error) {
    throw error;
  }
}

export async function deleteRecord(hostedZoneId, changes) {
  try {
    const { data, status } = await axios.post(
      `${import.meta.env.VITE_BASEURL}/recordsoperations`,
      { hostedZoneId, changes }
    );
    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createRecord(hostedZoneId, changes) {
  try {
    const { data, status } = await axios.post(
      `${import.meta.env.VITE_BASEURL}/recordsoperations`,
      { hostedZoneId, changes }
    );
    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteHostedZones(zones) {
  try {
    const { data, status } = await axios.delete(
      `${import.meta.env.VITE_BASEURL}/hostedzones`,
      { data: zones }
    );
    return { data, status };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
