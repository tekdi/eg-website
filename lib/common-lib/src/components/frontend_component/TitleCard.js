import { Box, HStack, Pressable } from 'native-base'
import React from 'react'

function TitleCardButton(props) {
  if (props?.onPress) {
    return (
      <Pressable onPress={props?.onPress}>
        <TitleCard {...props} />
      </Pressable>
    )
  } else {
    return <TitleCard {...props} />
  }
}

const TitleCard = ({
  _hstack,
  title,
  icon,
  _icon,
  _title,
  _body,
  children,
  onPress
}) => {
  return (
    <Pressable
      bg='white'
      borderColor={'garyTitleCardBorder'}
      borderStyle={'solid'}
      borderRadius={'6px'}
      borderWidth={'1px'}
      flexDirection={'row'}
      {..._hstack}
      flex={1}
      {...(onPress ? { onPress } : {})}
      shadow='TitleCardShadow'
    >
      <Box
        flex={20}
        bg='grayTitleCard'
        px={'4'}
        py={8}
        borderTopLeftRadius={'5px'}
        borderTopRightRadius={'0px'}
        borderBottomRightRadius={'50px'}
        borderBottomLeftRadius={'5px'}
        {..._title}
        {..._icon}
      >
        {title}
        {icon}
      </Box>
      <Box flex={80} px={4} py={8} {..._body}>
        {children}
      </Box>
    </Pressable>
  )
}

// export default React.memo(TitleCard)
export default TitleCard
