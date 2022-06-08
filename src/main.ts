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

    WA.room.onEnterLayer("beSellerZone").subscribe(() => {
      console.log("seller zone");
      if (!(WA.player.state.role == "seller")) {
        if (!(WA.player.state.role == "seller") === null || undefined) {
          console.log("There is already a seller, you cant enter");
          WA.player.moveTo(250, 250, 10);
        } else {
          const triggerMessage = WA.ui.displayActionMessage({
            message: "Wanna be a seller ? press 'space' to confirm",
            callback: () => {
              WA.player.state.role = "seller";
              WA.chat.sendChatMessage("confirmed", "You're a seller now");
            },
          });
          setTimeout(() => {
            triggerMessage.remove();
          }, 10000);
        }
      }
    });
    WA.room.onLeaveLayer("beSellerZone").subscribe(() => {
      console.log("leaving seller zone");
    });

    WA.room.onEnterLayer("buyingZone").subscribe(() => {
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
      }, 10000);
    });
    WA.room.onLeaveLayer("buyingZone").subscribe(() => {
      console.log("leaving buying zone");
    });
  })
  .catch((e) => console.error(e));

export {};
