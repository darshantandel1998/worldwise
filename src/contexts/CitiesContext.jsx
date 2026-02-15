import { createContext, useContext, useEffect, useReducer } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CitiesContext = createContext();

const initialState = {
  isLoading: false,
  error: "",
  cities: [],
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity:
          state.currentCity.id === action.payload ? {} : state.currentCity,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknow action type: " + action.type);
  }
}

export function CitiesContextProvider({ children }) {
  const [{ isLoading, error, cities, currentCity }, disaptch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    async function fetchCities() {
      disaptch({ type: "loading" });
      try {
        const res = await fetch(`${API_BASE_URL}/cities`);
        const data = await res.json();
        disaptch({ type: "cities/loaded", payload: data });
      } catch {
        disaptch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (id == currentCity.id) return;
    disaptch({ type: "loading" });
    try {
      const res = await fetch(`${API_BASE_URL}/cities/${id}`);
      const data = await res.json();
      disaptch({ type: "city/loaded", payload: data });
    } catch {
      disaptch({
        type: "rejected",
        payload: "There was an error loading city...",
      });
    }
  }

  async function createCity(city) {
    disaptch({ type: "loading" });
    try {
      const res = await fetch(`${API_BASE_URL}/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      });
      const data = await res.json();
      disaptch({ type: "city/created", payload: data });
    } catch {
      disaptch({
        type: "rejected",
        payload: "There was an error creating city...",
      });
    }
  }

  async function deleteCity(id) {
    disaptch({ type: "loading" });
    try {
      await fetch(`${API_BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      disaptch({ type: "city/deleted", payload: id });
    } catch {
      disaptch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        error,
        cities,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used out side the CitiesProvider");
  return context;
}
