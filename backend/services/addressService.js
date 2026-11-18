import Address from "../models/Address.js";

/* CREATE ADDRESS */
export async function createAddressService(userId, data) {
  // If first address → make default automatically
  const existing = await Address.find({ user: userId });

  const address = new Address({
    ...data,
    user: userId,
    isDefault: existing.length === 0,
  });

  return await address.save();
}

/* GET USER ADDRESSES */
export async function getUserAddressesService(userId) {
  return await Address.find({ user: userId }).sort({ createdAt: -1 });
}

/* UPDATE ADDRESS */
export async function updateAddressService(addressId, userId, data) {
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    data,
    { new: true }
  );

  if (!address) throw new Error("Address not found");

  return address;
}

/* DELETE ADDRESS */
export async function deleteAddressService(addressId, userId) {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) throw new Error("Address not found");

  return address;
}

/* SET DEFAULT ADDRESS */
export async function setDefaultAddressService(addressId, userId) {
  // remove default from all
  await Address.updateMany(
    { user: userId },
    { $set: { isDefault: false } }
  );

  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { isDefault: true },
    { new: true }
  );

  if (!address) throw new Error("Address not found");

  return address;
}