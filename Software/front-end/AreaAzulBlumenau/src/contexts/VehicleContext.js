import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

import { server, showErrorMessage } from '../utils/common';

export const VehicleContext = createContext();


export default ({ children }) => {
    const [vehicles, setVehicles] = useState();

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                res = await axios(
                    `${server}/vehicles/`
                );
                setVehicles(res.data);
            } catch(e) {
                console.log(e);
            }
        };

        loadVehicles();
    }, []);

    const vehicleCreate = async (licensePlate, vehicleModel, vehicleType) => {
        try {        
            res = await axios.post(
                `${server}/vehicles/`,
                {
                    license_plate: licensePlate,
                    model: vehicleModel,
                    vehicle_type: vehicleType
                }
            );

            newVehicle = res.data;
            
            setVehicles([...vehicles, newVehicle]);                        
            return true;
        } catch(e) {
            showErrorMessage(e);
        }
    };

    const vehicleUpdate = async (vehicleId, licensePlate, model, vehicleType) => {
        console.log(vehicleId, licensePlate, model, vehicleType)
        try {
            const res = await axios.put(
                `${server}/vehicles/${vehicleId}`,
                {
                    license_plate: licensePlate,
                    model: model,
                    vehicle_type: vehicleType,
                }
            )
            const updatedVehicle = res.data;
            const filteredVehicles = vehicles.filter(v => v.vehicle_id !== vehicleId);
            setVehicles([...filteredVehicles, updatedVehicle]);

            return true;
        } catch(e) {
            showErrorMessage(e);
        }
    };

    const vehicleDelete = async vehicleId => {
        try {
            await axios.delete(`${server}/vehicles/${vehicleId}`);
            const filteredVehicles = vehicles.filter(v => v.vehicle_id !== vehicleId);
            setVehicles(filteredVehicles);
        } catch(e) {            
            showErrorMessage(e);
        }
    }

    const teste = () => {
        console.log('teste');
    }

    return (
        <VehicleContext.Provider value={{vehicles, vehicleCreate, vehicleUpdate, vehicleDelete, teste}}>
            {children}
        </VehicleContext.Provider>
    )
};