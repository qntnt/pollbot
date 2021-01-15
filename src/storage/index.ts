import { Storage } from './interface'
import { FirestoreStorage } from './firestore'
import { STORAGE_TYPE } from '../settings'

export type StorageType = 'firestore'

function provideStorage(storageType: StorageType): Storage {
    switch (storageType) {
        case 'firestore':
            return new FirestoreStorage()
    }
}

export default provideStorage(STORAGE_TYPE)
