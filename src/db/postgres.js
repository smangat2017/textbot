import Pgp from 'pg-promise'
import { POSTGRES_URL } from '../config'
import queries from './queries'
import uuid from 'uuid'
const postgresdb = Pgp()(POSTGRES_URL)

function genUuid () {
  return uuid.v4().replace(/-/g, '')
}

export async function postgresdbExists () {
  try {
    const obj = await postgresdb.connect()
    obj.done()

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function createUsersTable () {
  return await postgresdb.none(queries.createUsersTableQuery.query)
}

export async function createUser ({
  name = '',
  phone,
  zipcode = '',
  status = ''
}) {
  const newuser = { id: genUuid(), name: name, phone: phone, zipcode: zipcode, status: status}
  return await postgresdb.one(queries.addUserQuery.query,newuser)
}

export async function updateUserStatus ({
  phone,
  status
}) {
  const update = { phone : phone, status : status}
  return await postgresdb.none(queries.updateUserStatusQuery.query,update)
}

export async function updateUserName ({
  phone,
  name
}) {
  const update = { phone: phone, name: name}
  return await postgresdb.none(queries.updateUserNameQuery.query,update)
}

export async function getUser ({
  phone
}) {
  const user = {phone: phone}
  return await postgresdb.any(queries.getUserQuery.query,user)
}

export async function getAllUsers () {
  return await postgresdb.query(queries.getAllUsersQuery.query)
}


export default exports
