import { VStack } from 'native-base'
import React from 'react'
import IconByName from './IconByName'
import { H2 } from './layout/HeaderTags'
import Loading from './Loading'

const SunbirdPlayer = ({
  public_url,
  setTrackData,
  handleExitButton,
  width,
  height,
  showExitButton,
  setShowExitButton,
  ...props
}) => {
  const { mimeType } = props
  let trackData = []

  const [url, setUrl] = React.useState()

  React.useEffect(() => {
    localStorage.removeItem('trackDATA')
  }, [])

  React.useEffect(() => {
    if (mimeType === 'application/pdf') {
      setUrl(`/pdf`)
    } else if (['video/mp4', 'video/webm'].includes(mimeType)) {
      setUrl(`/video`)
    } else if (['application/vnd.sunbird.questionset'].includes(mimeType)) {
      setUrl(`/quml`)
    } else if (
      [
        'application/vnd.ekstep.ecml-archive',
        'application/vnd.ekstep.html-archive',
        'application/vnd.ekstep.content-collection',
        'application/vnd.ekstep.h5p-archive',
        'video/x-youtube'
      ].includes(mimeType)
    ) {
      setUrl(`/content-player`)
    }
  }, [mimeType])

  React.useEffect(() => {
    const handleEvent = (event) => {
      const data = event?.data
      let telemetry = {}
      if (data && typeof data?.data === 'string') {
        telemetry = JSON.parse(data.data)
      } else if (data && typeof data === 'string') {
        telemetry = JSON.parse(data)
      } else if (data?.eid) {
        telemetry = data
      }

      if (telemetry?.eid === 'EXDATA') {
        try {
          const edata = JSON.parse(telemetry.edata?.data)
          if (edata?.statement?.result) {
            trackData = [...trackData, edata?.statement]
          }
        } catch (e) {
          console.log('telemetry format h5p is wrong', e.message)
        }
      }
      if (telemetry?.eid === 'ASSESS') {
        const edata = telemetry?.edata
        //console.log('edata', edata)
        //bug fixes for back question answer empty value added one condition if (edata?.resvalues && edata?.resvalues.length > 0) {}
        if (edata?.resvalues && edata?.resvalues.length > 0) {
          if (trackData.find((e) => e?.item?.id === edata?.item?.id)) {
            const filterData = trackData.filter(
              (e) => e?.item?.id !== edata?.item?.id
            )
            trackData = [
              ...filterData,
              {
                ...edata,
                sectionName: props?.children?.find(
                  (e) => e?.identifier === telemetry?.edata?.item?.sectionId
                )?.name
              }
            ]
          } else {
            trackData = [
              ...trackData,
              {
                ...edata,
                sectionName: props?.children?.find(
                  (e) => e?.identifier === telemetry?.edata?.item?.sectionId
                )?.name
              }
            ]
          }
        }
        // console.log(telemetry, trackData)
        localStorage.setItem('trackDATA', JSON.stringify(trackData))
      } else if (
        telemetry?.eid === 'INTERACT' &&
        mimeType === 'video/x-youtube'
      ) {
      } else if (telemetry?.eid === 'END') {
        setShowExitButton(true)

        const summaryData = telemetry?.edata
        if (summaryData?.summary && Array.isArray(summaryData?.summary)) {
          const score = summaryData.summary.find((e) => e['score'])
          if (score?.score) {
            setTrackData({
              ...telemetry?.edata,
              score: score?.score,
              trackData
            })
          } else {
            setTrackData(telemetry?.edata)
            // handleExitButton()
          }
        } else {
          setTrackData(telemetry?.edata)
        }
      } else if (
        telemetry?.eid === 'IMPRESSION' &&
        telemetry?.edata?.pageid === 'summary_stage_id'
      ) {
        setTrackData(trackData)
      } else if (['INTERACT', 'HEARTBEAT'].includes(telemetry?.eid)) {
        if (
          telemetry?.edata?.id === 'exit' ||
          telemetry?.edata?.type === 'EXIT'
        ) {
          handleExitButton()
        }
      }
    }

    if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes(url)) {
      window.addEventListener('message', handleEvent, false)
    }

    return () => {
      if ([`/content-player`, `/quml`, `/pdf`, `/video`].includes(url)) {
        window.removeEventListener('message', handleEvent)
      }
    }
  }, [url])

  if (url) {
    return (
      <VStack {...{ width, height }}>
        {showExitButton && (
          <IconByName
            name='CloseCircleLineIcon'
            onPress={() => {
              if (mimeType === 'application/vnd.ekstep.h5p-archive') {
                handleEvent({
                  data: {
                    eid: 'IMPRESSION',
                    edata: { pageid: 'summary_stage_id' }
                  }
                })
              }
              handleExitButton()
            }}
            position='absolute'
            zIndex='10'
            left='15px'
            top='-50px'
            _icon={{ size: 40 }}
            bg='white'
            p='0'
            rounded='full'
          />
        )}
        <iframe
          style={{ border: 'none' }}
          id='preview'
          height={'100%'}
          width='100%'
          name={JSON.stringify({
            ...props,
            questionListUrl: `${`${process.env.REACT_APP_API_URL}/events/camp-question-list`} `
            // questionListUrl: `${process.env.REACT_APP_API_URL}/course/questionset`
          })}
          src={`${public_url || process.env.PUBLIC_URL}${url}/index.html`}
        />
      </VStack>
    )
  } else {
    return <H2>{`${mimeType} this mime type not compatible`}</H2>
  }
}

export default React.memo(SunbirdPlayer)
