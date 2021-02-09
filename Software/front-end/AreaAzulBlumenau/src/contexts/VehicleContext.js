import axios from 'axios';
import React, { createContext, useEffect, useReducer } from 'react';

import Loading from '../screens/LoadingScreen';
import { server, showErrorMessage } from '../utils/common';

export const VehicleContext = createContext();


export default ({ children }) => {
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_VEHICLES':
                return {
                    ...prevState,
                    isLoading: false,
                    vehicles: action.vehicles,
                }          
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    vehicles: null,
                }
        }
    }

    const initialState = {
        isLoading: true,
        vehicles: [],
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const loadVehicles = async () => {
        try {
            res = await axios(
                `${server}/vehicles/`
            );
                   
            dispatch({ type: 'RESTORE_VEHICLES', vehicles: res.data });                
        } catch(e) {
            dispatch({ type: 'RESTORE_VEHICLES', vehicles: null });
            console.log(e);
        }
    };

    useEffect(() => {        
        loadVehicles();
    }, []);

    const createVehicle = async (licensePlate, vehicleModel, vehicleType) => {
        try {        
            res = await axios.post(
                `${server}/vehicles/`,
                {
                    license_plate: licensePlate,
                    model: vehicleModel,
                    vehicle_type: vehicleType
                }
            );

            loadVehicles();
            return true;
        } catch(e) {
            showErrorMessage(e);
        }
    };

    const updateVehicle = async (vehicleId, licensePlate, model, vehicleType) => {        
        try {
            const res = await axios.put(
                `${server}/vehicles/${vehicleId}`,
                {
                    license_plate: licensePlate,
                    model: model,
                    vehicle_type: vehicleType,
                }
            )
            
            loadVehicles();
            return true;
        } catch(e) {
            showErrorMessage(e);
        }
    };

    const deleteVehicle = async vehicleId => {
        try {
            await axios.delete(`${server}/vehicles/${vehicleId}`);
            
            loadVehicles();            
        } catch(e) {            
            showErrorMessage(e);
        }
    };

    if (state.isLoading) {
        return <Loading />
    }

    return (
        <VehicleContext.Provider value={{
            vehicles: state.vehicles, 
            createVehicle, 
            updateVehicle, 
            deleteVehicle, 
            loadVehicles,
            clearVehicle: () => dispatch({ type: 'SIGN_OUT'})
        }}>
            {children}
        </VehicleContext.Provider>
    );
};