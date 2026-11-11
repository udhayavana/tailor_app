function createPhoneKey(countryCode, phoneNumber) {
  return `${countryCode}${phoneNumber.replace(/\D/g, '')}`
}

const demoAccounts = new Map()
const existingDemoNumber = '9876543210'
demoAccounts.set(createPhoneKey('+91', existingDemoNumber), {
  fullName: 'Demo Customer',
  address: 'Demo address',
  countryCode: '+91',
  phoneNumber: existingDemoNumber,
  alternateCountryCode: '+91',
  alternatePhone: '',
})

export async function findAccount(countryCode, phoneNumber) {
  return demoAccounts.get(createPhoneKey(countryCode, phoneNumber)) || null
}

export async function registerAccount(profile) {
  const accountKey = createPhoneKey(profile.countryCode, profile.phoneNumber)
  const existingAccount = demoAccounts.get(accountKey)

  if (existingAccount) {
    return existingAccount
  }

  const account = { ...profile }
  demoAccounts.set(accountKey, account)

  return account
}

export async function updateAccount(currentAccount, profile) {
  const currentKey = createPhoneKey(currentAccount.countryCode, currentAccount.phoneNumber)
  const nextKey = createPhoneKey(profile.countryCode, profile.phoneNumber)
  const existingAccount = demoAccounts.get(currentKey)

  if (!existingAccount) {
    throw new Error('Profile could not be found.')
  }

  if (nextKey !== currentKey && demoAccounts.has(nextKey)) {
    throw new Error('That primary mobile number is already registered.')
  }

  const updatedAccount = { ...existingAccount, ...profile }
  if (nextKey !== currentKey) {
    demoAccounts.delete(currentKey)
  }
  demoAccounts.set(nextKey, updatedAccount)

  return updatedAccount
}
