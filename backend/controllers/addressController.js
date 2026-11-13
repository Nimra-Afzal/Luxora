import {
  createAddressService,
  getUserAddressesService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from "../services/addressService.js";

/* CREATE */
export async function createAddress(req, res) {
  try {
    const address = await createAddressService(req.user.id, req.body);
    res.status(201).json({ address });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* GET */
export async function getUserAddresses(req, res) {
  try {
    const addresses = await getUserAddressesService(req.user.id);
    res.json({ addresses });
  } catch {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
}

/* UPDATE */
export async function updateAddress(req, res) {
  try {
    const address = await updateAddressService(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ address });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* DELETE */
export async function deleteAddress(req, res) {
  try {
    await deleteAddressService(req.params.id, req.user.id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

/* SET DEFAULT */
export async function setDefaultAddress(req, res) {
  try {
    const address = await setDefaultAddressService(
      req.params.id,
      req.user.id
    );
    res.json({ address });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}