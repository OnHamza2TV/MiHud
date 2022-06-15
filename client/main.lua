function GetProximity(proximity)
    for k,v in pairs(config.proximityModes) do
        if v[1] == proximity then
            return v[2]
        end
    end
    return 0
end

CreateThread(function()
    local panelShown, lastState, lastProximity, lastInVehicle = false, false, 0, false

    while true do
        Wait(1)

        -- panel
        if IsControlJustReleased(0, config.panelKey) then
            panelShown = not panelShown

            if panelShown then
                SetNuiFocus(true, true)
                SetNuiFocusKeepInput(true)
            else
                SetNuiFocus(false, false)
                SetNuiFocusKeepInput(false)
            end

            SendNUIMessage({
                action = 'panel'
            })
        end

        if panelShown then
            DisableAllControlActions(0)
            EnableControlAction(0, config.panelKey, true)
        end

        -- voice
        local state = NetworkIsPlayerTalking(PlayerId())

        if state ~= lastState then
            SendNUIMessage({
                action = 'talking',
                data = state
            })
        end

        lastState = state

        -- proximity
        local proximity = NetworkGetTalkerProximity()

        if proximity ~= lastProximity then
            SendNUIMessage({
                action = 'proximity',
                data = GetProximity(proximity)
            })
        end

        lastProximity = proximity

        local ped = PlayerPedId()

        -- in/out vehicle
        local inVehicle = IsPedInAnyVehicle(ped)

        if inVehicle ~= lastInVehicle then
            SendNUIMessage({
                action = 'inCar',
                data = inVehicle
            })
        end

        lastInVehicle = inVehicle
    end
end)

CreateThread(function()
    while true do
        Wait(config.refreshInterval)

        -- status
        local ped = GetPlayerPed(-1)
        local health, armor, hunger, thirst, drunk = GetEntityHealth(ped) - 100, GetPedArmour(ped)

        TriggerEvent('esx_status:getStatus', 'hunger', function(status)
            hunger = status.getPercent()
        end)

        TriggerEvent('esx_status:getStatus', 'thirst', function(status)
            thirst = status.getPercent()
        end)

        TriggerEvent('esx_status:getStatus', 'drunk', function(status)
            drunk = status.getPercent()
        end)

        SendNUIMessage({
            action = 'update',
            data = {
                health = health,
                armor = armor,
                hunger = hunger,
                thirst = thirst,
                drunk = drunk
            }
        })
    end
end)

author 'Cartel'