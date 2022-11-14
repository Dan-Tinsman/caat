import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Session } from "@supabase/gotrue-js/src/lib/types"
import styled from 'styled-components';
import { FileUploader } from "react-drag-drop-files";
import { saveAs } from 'file-saver';

const Wrapper = styled.section`
    padding: 20px;
    border: solid 1px #ddd;
    border-top: solid 5px hsl(153 60% 53%);
    border-bottom-width: 2px;
    border-radius: 5px;
    max-width: 60%;
    margin: 12px;
`;

const FileUploaderContainer = styled.div`
    padding: 10px;
    margin: 12px;
`

const PageContainer = styled.div`
    margin: auto;
    width: 95%;
    border: 3px solid black;
    border-radius: 10px;
    padding: 10px;
    background-color: azure;
`

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    justify-items: center;
`

type Client = {
    id: number;
    name: string;
    upload_bucket: string;
    download_bucket: string;
}

const fileTypes = ["CSV"];

export async function getBuckets() {
    return await supabase.from('clients').select(`*`).single()
}
type ClientResponse = Awaited<ReturnType<typeof getBuckets>>
export type ClientResponseSuccess = ClientResponse['data']
export type ClientResponseError = ClientResponse['error']

const Account = ({ session }: { session: Session }) => {

    /* TODO 
    1. [√] Get client upload bucket
    2. [√] Get client download bucket
    3. [√] Display uploads from the same client
    4. [√] Display available downloads for the same client
    5. [√] Enable downloading the available downloads
    */

    const [clientName, setClientName] = useState<Client["name"] | null>(null)
    const [uploadBucket, setUploadBucket] = useState<Client["upload_bucket"] | null>(null)
    const [downloadBucket, setDownloadBucket] = useState<Client["download_bucket"] | null>(null)
    const [uploads, setUploads] = useState<any>(null)
    const [availableDownloads, setAvailableDownloads] = useState<any>(null)

    useEffect(() => {
        async function setBuckets() {
            const { data, error }: ClientResponse = await getBuckets()

            if (error) {
                throw error
            }

            if (data) {
                setClientName(data.name)
                setUploadBucket(data.upload_bucket)
                setDownloadBucket(data.download_bucket)
            }
        }

        async function getUploads() {
            try {
                const { data, error } = await supabase
                    .from('uploads')
                    .select('*')

                if (error) {
                    throw error
                }

                if (data) {
                    setUploads(data)
                }
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        async function getAvailableDownloads() {
            if (downloadBucket) {
                try {
                    const { data, error } = await supabase
                        .storage
                        .from(downloadBucket)
                        .list(undefined, {
                            limit: 12,
                            offset: 0,
                            sortBy: { column: 'created_at', order: 'desc' },
                        })

                    if (error) {
                        throw error
                    }

                    if (data) {
                        setAvailableDownloads(data)
                    }
                } catch (error) {
                    alert(JSON.stringify(error))
                }
            }
        }

        setBuckets()
        getUploads()
        getAvailableDownloads()
    }, [uploadBucket, downloadBucket])

    // TODO: https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies

    const downloadFileFromBucket = async (bucket: string, path: string) => {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .download(path)

        if (error) {
            console.log(JSON.stringify(error))
            throw error
        }

        if (data) {
            saveAs(data, path)
        }
    }

    const handleChange = async (file: any) => {
        if (uploadBucket) {
            const { data, error } = await supabase.storage
                .from(uploadBucket ? uploadBucket : '')
                .upload(file.name, file)

            if (error) {
                throw error
            }

            if (data) {
                await supabase
                    .from('uploads')
                    .insert([
                        { path: data.path, user_id: session.user.id, bucket: uploadBucket }
                    ])
            }
        }
    };

    return (
        <PageContainer>
            <div>Client: {clientName}</div>
            <FileUploaderContainer>
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
            </FileUploaderContainer>

            <GridContainer>
                {uploads &&
                    <Wrapper>
                        <div style={{ textAlign: 'center' }}>Uploads</div>
                        <div>Bucket: {uploadBucket}</div>
                        <div>-----------------------------------------</div>
                        <div>
                            {uploads?.map((file: { path: string; }) => <p key={file.path}>{file.path}</p>)}
                        </div>

                    </Wrapper>
                }
                {availableDownloads &&
                    <Wrapper>
                        <div style={{ textAlign: 'center' }}>Downloads</div>
                        <div>Bucket: {downloadBucket}</div>
                        <div>-----------------------------------------</div>
                        <div>
                            {availableDownloads?.map((file: { name: string; }) =>
                                <div>
                                    <p key={file.name}>{file.name}</p>
                                    {downloadBucket ? <button onClick={() => downloadFileFromBucket(downloadBucket, file.name)}>download</button> : null}
                                </div>
                            )}
                        </div>

                    </Wrapper>
                }
            </GridContainer>


            <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
                Sign Out
            </button>
        </PageContainer>
    )
}

export default Account