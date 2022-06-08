/// <reference types="@workadventure/iframe-api-typings" />

console.log("Script started successfully");

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);
    // Attribution du rôle par défaut
    WA.player.state.role = "buyer";
    console.log(WA.player.state.role);
    // Variable globale pour check si role Seller est déjà attribué
    WA.state.saveVariable("alreadyGiveRoleSeller", false);

    WA.state
      .onVariableChange("alreadyGiveRoleSeller")
      .subscribe((alreadyGiveRoleSeller) => {
        console.log(
          'Variable "config" changed. New value: ',
          alreadyGiveRoleSeller
        );
      });
    // BeSellerZone
    WA.room.onEnterLayer("beSellerZone").subscribe(() => {
      console.log("seller zone");

      if (WA.state.loadVariable("alreadyGiveRoleSeller") === false) {
        const triggerMessage = WA.ui.displayActionMessage({
          message: "Wanna be a seller ? press 'space' to confirm",
          callback: () => {
            WA.state.config = {
              alreadyGiveRoleSeller: true,
            };
            WA.state.saveVariable("alreadyGiveRoleSeller", true);
            //WA.player.state.role = "seller";
            console.log(WA.player.state.role);
            //console.log("alreadyGiveRoleSeller", config);
            WA.chat.sendChatMessage("confirmed", "You're a seller now");
          },
        });
        setTimeout(() => {
          triggerMessage.remove();
        }, 6000);
      } else if (
        WA.state.loadVariable("alreadyGiveRoleSeller") === true &&
        (WA.player.state.role = "buyer")
      ) {
        console.log("There is already a seller, you cant enter");
        console.log(
          "alreadyGiveRoleSeller",
          WA.state.loadVariable("alreadyGiveRoleSeller")
        );
        WA.player.moveTo(250, 250, 10);
      }
    });
    WA.room.onLeaveLayer("beSellerZone").subscribe(() => {
      console.log("leaving seller zone");
    });

    // BuyingZone
    WA.room.onEnterLayer("buyingZone").subscribe(async () => {
      console.log("buying zone");
      const triggerMessage = WA.ui.displayActionMessage({
        message: "press 'space' to confirm",
        callback: () => {
          WA.chat.sendChatMessage("confirmed", "trigger message logic");
        },
      });
      setTimeout(() => {
        // later
        triggerMessage.remove();
      }, 6000);
      // Object Sell Appear
      const objectSell = await WA.ui.website.open({
        url: "https://wikipedia.org/",
        position: {
          vertical: "bottom",
          horizontal: "left",
        },
        size: {
          height: "300px",
          width: "200px",
        },
      });

      objectSell.position.vertical = "top";
    });
    WA.room.onLeaveLayer("buyingZone").subscribe(() => {
      console.log("leaving buying zone");
    });
  })
  .catch((e) => console.error(e));

export {};
