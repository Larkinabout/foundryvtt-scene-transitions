import CONSTANTS from "../constants.js";
// =============================
// Module Generic function
// =============================
// export async function getToken(documentUuid) {
//   const document = await fromUuid(documentUuid);
//   //@ts-ignore
//   return document?.token ?? document;
// }
// export function getOwnedTokens(priorityToControlledIfGM) {
//   const gm = game.user?.isGM;
//   if (gm) {
//     if (priorityToControlledIfGM) {
//       const arr = canvas.tokens?.controlled;
//       if (arr && arr.length > 0) {
//         return arr;
//       } else {
//         return canvas.tokens?.placeables;
//       }
//     } else {
//       return canvas.tokens?.placeables;
//     }
//   }
//   if (priorityToControlledIfGM) {
//     const arr = canvas.tokens?.controlled;
//     if (arr && arr.length > 0) {
//       return arr;
//     }
//   }
//   let ownedTokens = canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.document.hidden || gm));
//   if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
//     ownedTokens = canvas.tokens?.placeables.filter(
//       (token) => (token.observer || token.isOwner) && (!token.document.hidden || gm)
//     );
//   }
//   return ownedTokens;
// }
// export function is_UUID(inId) {
//   return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
// }
// export function getUuid(target) {
//   // If it's an actor, get its TokenDocument
//   // If it's a token, get its Document
//   // If it's a TokenDocument, just use it
//   // Otherwise fail
//   const document = getDocument(target);
//   return document?.uuid ?? false;
// }
// export function getDocument(target) {
//   if (target instanceof foundry.abstract.Document) return target;
//   return target?.document;
// }
// export function isGMConnected() {
//   return !!Array.from(game.users).find((user) => user.isGM && user.active);
// }
// export function isGMConnectedAndSocketLibEnable() {
//   return isGMConnected(); // && !game.settings.get(CONSTANTS.MODULE_ID, 'doNotUseSocketLibFeature');
// }
// export function wait(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
// export function isActiveGM(user) {
//   return user.active && user.isGM;
// }
// export function getActiveGMs() {
//   return game.users?.filter(isActiveGM);
// }
// export function isResponsibleGM() {
//   if (!game.user?.isGM) return false;
//   //@ts-ignore
//   return !getActiveGMs()?.some((other) => other._id < game.user?._id);
// }
// export function firstGM() {
//   return game.users?.find((u) => u.isGM && u.active);
// }
// export function isFirstGM() {
//   return game.user?.id === firstGM()?.id;
// }
// export function firstOwner(doc) {
//   /* null docs could mean an empty lookup, null docs are not owned by anyone */
//   if (!doc) return undefined;
//   const permissionObject = (doc instanceof TokenDocument ? doc.actor?.permission : doc.permission) ?? {};
//   const playerOwners = Object.entries(permissionObject)
//     .filter(([id, level]) => !game.users?.get(id)?.isGM && game.users?.get(id)?.active && level === 3)
//     .map(([id, level]) => id);
//   if (playerOwners.length > 0) {
//     return game.users?.get(playerOwners[0]);
//   }
//   /* if no online player owns this actor, fall back to first GM */
//   return firstGM();
// }
// /* Players first, then GM */
// export function isFirstOwner(doc) {
//   return game.user?.id === firstOwner(doc)?.id;
// }
// =============================
// Module specific function
// =============================

export function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function stripQueryStringAndHashFromPath(url) {
  let myUrl = url;
  if (!myUrl) {
    return myUrl;
  }
  if (myUrl.includes("?")) {
    myUrl = myUrl.split("?")[0];
  }
  if (myUrl.includes("#")) {
    myUrl = myUrl.split("#")[0];
  }
  return myUrl;
}
export function retrieveFirstImageFromJournalId(id, pageId, noDefault) {
  const journalEntry = game.journal.get(id);
  let firstImage = undefined;
  if (!journalEntry) {
    return firstImage;
  }
  // Support old data image
  // if (journalEntry?.data?.img) {
  // 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
  // }
  // Support new image type journal
  if (journalEntry?.pages.size > 0) {
    const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
    if (pageId) {
      const pageSelected = sortedArray.find((page) => page.id === pageId);
      if (pageSelected) {
        if (pageSelected.type === "image" && pageSelected.src) {
          firstImage = stripQueryStringAndHashFromPath(pageSelected.src);
        }
        // this should manage all MJE type
        else if (pageSelected.src) {
          firstImage = stripQueryStringAndHashFromPath(pageSelected.src);
        }
      }
    }
    // const shouldCheckForDefault = !noDefault && pageId?.length > 0;
    if (!noDefault && !firstImage) {
      for (const pageEntry of sortedArray) {
        if (pageEntry.type === "image" && pageEntry.src) {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        } else if (pageEntry.src && pageEntry.type === "pdf") {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        }
        // this should manage all MJE type
        else if (pageEntry.src) {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        }
      }
    }
  }
  return firstImage;
}

export function retrieveFirstTextFromJournalId(id, pageId, noDefault) {
  const journalEntry = game.journal.get(id);
  let firstText = undefined;
  if (!journalEntry) {
    return firstText;
  }
  // Support old data image
  // if (journalEntry?.data?.img) {
  // 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
  // }
  // Support new image type journal
  if (journalEntry?.pages.size > 0) {
    const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
    if (pageId) {
      const pageSelected = sortedArray.find((page) => page.id === pageId);
      if (pageSelected) {
        if (pageSelected.type === "text" && pageSelected.text?.content) {
          firstText = pageSelected.text?.content;
        }
        // this should manage all MJE type
        else if (pageSelected.text?.content) {
          firstText = pageSelected.text?.content;
        }
      }
    }
    // const shouldCheckForDefault = !noDefault && pageId?.length > 0;
    if (!noDefault && !firstText) {
      for (const journalEntry of sortedArray) {
        if (journalEntry.type === "text" && journalEntry.text?.content) {
          firstText = journalEntry.text?.content;
          break;
        }
        // this should manage all MJE type
        else if (journalEntry.text?.content) {
          firstText = journalEntry.text?.content;
          break;
        }
      }
    }
  }
  return firstText;
}

export class SceneTransitionOptions {
  constructor(options) {
    this.action = options.action || "";
    this.sceneID = options.sceneID || "";
    this.gmHide = isBoolean(options.gmHide) ? options.gmHide : true;
    this.fontColor = options.fontColor || "#777777";
    this.fontSize = options.fontSize || "28px";
    this.bgImg = options.bgImg || "";
    this.bgPos = options.bgPos || "center center";
    this.bgLoop = isBoolean(options.bgLoop) ? options.bgLoop : true;
    this.bgMuted = isBoolean(options.bgMuted) ? options.bgMuted : true;
    this.bgSize = options.bgSize || "cover";
    this.bgColor = options.bgColor || "#000000";
    this.bgOpacity = options.bgOpacity || 0.7;
    this.fadeIn = options.fadeIn || 400;
    this.delay = options.delay || 4000;
    this.fadeOut = options.fadeOut || 1000;
    this.volume = options.volume || 1.0;
    this.audioLoop = isBoolean(options.audioLoop) ? options.audioLoop : true;
    this.skippable = isBoolean(options.skippable) ? options.skippable : true;
    this.gmEndAll = isBoolean(options.gmEndAll) ? options.gmEndAll : true;
    this.showUI = isBoolean(options.showUI) ? options.showUI : false;
    this.activateScene = isBoolean(options.activateScene) ? options.activateScene : false;
    this.content = options.content || "";
    this.audio = options.audio || "";
    this.fromSocket = isBoolean(options.fromSocket) ? options.fromSocket : false;
    this.users = options.users || [];
  }
}

export function isBoolean(value) {
  if (String(value) === "true" || String(value) === "false") {
    return true;
  } else {
    return false;
  }
}

export function isVideo(imgSrc) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(imgSrc)?.[1];
  return ext === "webm" || ext === "mp4";
}

export function getVideoType(imgSrc) {
  if (imgSrc.endsWith("webm")) {
    return "video/webm";
  } else if (imgSrc.endsWith("mp4")) {
    return "video/mp4";
  }
  return "video/mp4";
}
