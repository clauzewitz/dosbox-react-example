export interface IdbFileSystem {
    save(fileName: string, data: any): Promise<void>
    load(fileName: string): Promise<void>
}

export default async function (): Promise<IdbFileSystem> {
    const dbName: string = 'testDB';
    const dbVersion: number = 1;
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const dbRequest: IDBOpenDBRequest = window.indexedDB.open(dbName, dbVersion);

        dbRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            dbRequest?.result?.createObjectStore?.('testFile');
        };
        dbRequest.onsuccess = (event: Event) => {
            console.log('db created.');
            resolve(dbRequest.result);
        };
        dbRequest.onerror = (event: Event) => {
            console.log('db create failed.');
            reject(dbRequest.error);
        }
    });

    return {
        save(fileName: string, data: any): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const dbRequest = database.transaction?.(['testFile'], 'readwrite')?.objectStore?.('testFile')?.put?.(data, fileName);
                dbRequest.onsuccess = (event: Event) => {
                    console.log('db saved.');
                };
                dbRequest.onerror = (event: Event) => {
                    console.log('db save failed.', dbRequest.error);
                    reject();
                };
            });
        },
        load(fileName: string): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const dbRequest = database.transaction?.(['testFile'], 'readonly')?.objectStore?.('testFile')?.get?.(fileName);
                dbRequest.onsuccess = (event: Event) => {
                    console.log('db loaded.', dbRequest.result);
                    resolve();
                };
                dbRequest.onerror = (event: Event) => {
                    console.log('db load failed.', dbRequest.error);
                    reject();
                };
            });
        }
    };
}