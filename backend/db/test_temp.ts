import { NotFoundError } from "../error_class/custom-errors.js";
import { DebianPackageInfo } from "../types/apt.js";
import { AurPackage } from "../types/aur.js";
import { ArchPackage } from "../types/pacman.js";
import { WingetPackage } from "../types/winget.js";

const wingetTempDB = new Map<string, WingetPackage>();

// For arch
const pacmanTempDB = new Map<string, ArchPackage>()
const aurTempDB = new Map<number, AurPackage>()

// For Debian
const aptTempDB = new Map<string, DebianPackageInfo>()

export async function wingetStoreData(data: WingetPackage[]) {
  data.forEach((singleData) => {
    if (!wingetTempDB.has(singleData.Id)) {
      wingetTempDB.set(singleData.Id, singleData);
    }
  });
}

export function wingetGetData(id: string) {
  console.log(id);
  const result = wingetTempDB.get(id);

  if (!result) {
    throw new NotFoundError(`${id} winget package not found`);
  }

  return result;
}


export async function pacmanStoreData(data: ArchPackage[]) {
  data.forEach((singleData) => {
    if (!pacmanTempDB.has(`${singleData.pkgname}-${singleData.arch}`)) {
      pacmanTempDB.set(`${singleData.pkgname}-${singleData.arch}`, singleData)
    }
  })
}

export async function pacmanGetData(id: string) {
  console.log(id)
  const result = pacmanTempDB.get(id)

  if (!result) {
    throw new NotFoundError(`${id} pacman package not found`)
  }

  return result
}

export async function aurStoreData(data: AurPackage[]) {
  data.forEach((singleData) => {
    if (!aurTempDB.has(singleData.ID)) {
      aurTempDB.set(singleData.ID, singleData)
    }
  })
}

export async function aurGetData(id: number) {
  const result = aurTempDB.get(id)

  if (!result) {
    throw new NotFoundError(`${id} AUR package not found`)
  }

  return result
}

// In here unlike other packages we are going load data if a user gets into a package detail.
// We are doing this because debian doesn't provide multiple package search with their details
export async function aptStoreData(data: DebianPackageInfo) {
  if (!aptTempDB.has(data.package)) {
    aptTempDB.set(data.package, data)
  }
}

export async function aptGetData(packageName: string) {
  const result = aptTempDB.get(packageName)
  if (!result) {
    throw new NotFoundError(`${packageName} Debian APT package not found`)
  }
  return result
}
