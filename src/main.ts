/// <reference types="@workadventure/iframe-api-typings" />

console.log("Script started successfully");

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);


    WA.room.onEnterLayer("buyingZone").subscribe(() => {
      console.log("buying zone")
      WA.ui.displayActionMessage({
        message: "press 'space' to confirm",
        callback: () => {
          WA.chat.sendChatMessage("confirmed", "trigger message logic")
        }
      });
    })
    WA.room.onLeaveLayer("buyingZone").subscribe(() => {
      console.log("leaving buying zone")
    })

  })
  .catch((e) => console.error(e));

export { };
