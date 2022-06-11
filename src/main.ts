/// <reference types="@workadventure/iframe-api-typings" />

import {CoWebsite} from "@workadventure/iframe-api-typings/Api/iframe/nav";

console.log("Script started successfully");
let iframeRight: CoWebsite;
// Waiting for the API to be ready
WA.onInit()
    .then(() => {
        console.log("Scripting API ready");
        console.log("Player tags: ", WA.player.tags);
        // Attribution du rôle par défaut
        WA.player.state.role = "buyer";
        console.log(WA.player.state.role);

        WA.state.onVariableChange("isABuyer").subscribe((isABuyer) => {
            console.log('Variable "isABuyer" changed. New value: ', isABuyer);
        });

        WA.state
            .onVariableChange("someoneInEnchereRoom")
            .subscribe((someoneInEnchereRoom) => {
                console.log(
                    'Variable "someoneInEnchereRoom" changed. New value: ',
                    someoneInEnchereRoom
                );
            });

        // EnchereZone
        WA.room.onEnterLayer("enchereZone").subscribe(async () => {
            console.log("enchereZone zone");
            WA.player.state.role = "buyer";
            WA.state.saveVariable("someoneInEnchereRoom", true);
            console.log("Enchere Zone, Vous etes : ", WA.player.state.role);
        });
        WA.room.onLeaveLayer("enchereZone").subscribe(() => {
            console.log("leaving enchereZone");
            WA.state.saveVariable("someoneInEnchereRoom", false);
        });
        // BeSellerZone
        WA.room.onEnterLayer("beSellerZone").subscribe(() => {
            console.log("seller zone");
            if (WA.state.loadVariable("someoneInEnchereRoom") === true) {
                if (
                    WA.state.loadVariable("isABuyer") === false &&
                    WA.player.state.role === "buyer"
                ) {
                    console.log("There is already a seller, you cant enter");
                    WA.player.moveTo(250, 250, 10);
                } else {
                    const triggerMessage = WA.ui.displayActionMessage({
                        message: "Wanna be a seller ? press 'space' to confirm",
                        callback: () => {
                            WA.state.saveVariable("isABuyer", false);
                            WA.player.state.role = "seller";
                            console.log(WA.player.state.role);
                            WA.chat.sendChatMessage("confirmed", "You're a seller now");
                        },
                    });
                    setTimeout(() => {
                        triggerMessage.remove();
                    }, 6000);
                }
            } else {
            }
        });
        WA.room.onLeaveLayer("beSellerZone").subscribe(() => {
            console.log("leaving seller zone");
            if (
                WA.state.loadVariable("isABuyer") === false &&
                WA.player.state.role === "seller" &&
                WA.state.loadVariable("someoneInEnchereRoom") === true
            ) {
                const triggerMessage = WA.ui.displayActionMessage({
                    message: "Leave you're role of seller ? press 'space' to confirm",
                    callback: () => {
                        WA.state.saveVariable("isABuyer", true);
                        WA.player.state.role = "buyer";
                        WA.chat.sendChatMessage("confirmed", "You're a not seller now");
                    },
                });
                setTimeout(() => {
                    triggerMessage.remove();
                }, 6000);
            } else {
                console.log("not permitted");
            }
        });

        // BuyingZone
        WA.room.onEnterLayer("buyingZone").subscribe(async () => {
            iframeRight = await WA.nav.openCoWebSite(
                "http://localhost:8000/index.html?userToken=" +
                WA.player.userRoomToken +
                "&zone=buyingZone"
                + "&name=" + WA.player.name
            );
            const triggerMessage = WA.ui.displayActionMessage({
                message: "Wanna be a buyer ?press 'space' to confirm",
                callback: () => {
                    WA.chat.sendChatMessage(
                        "confirmed",
                        "Take a sit as buyer and follow"
                    );
                },
            });
            setTimeout(() => {
                // later
                triggerMessage.remove();
            }, 10000);
        });
        WA.room.onLeaveLayer("buyingZone").subscribe(() => {
            console.log("leaving buying zone");
            iframeRight.close();
        });
    })

    .catch((e) => console.error(e));

export {};
