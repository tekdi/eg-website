import React from 'react'
import { HStack, Text, Box, VStack, Avatar } from 'native-base'

export default function Header({
  title,
  iconComponent,
  headingComponent,
  subHeadingComponent,
  avatar,
  subHeading,
  isDisabledHeader,
  customeComponent,
  _box,
  _heading,
  _subHeading
}: any) {
  let newAvatar = localStorage.getItem('firstName')
  return !isDisabledHeader ? (
    customeComponent || (
      <Box {..._box} py={7} px={5}>
        <HStack justifyContent='space-between' alignItems='center'>
          <VStack>
            {subHeadingComponent || (
              <Text fontSize='12px' {..._subHeading}>
                {subHeading}
              </Text>
            )}

            {headingComponent || (
              <Text bold fontSize='24px' {..._heading}>
                {title}
              </Text>
            )}
          </VStack>
          {iconComponent || (
            <Avatar bg='amber.500' borderRadius='5px'>
              {newAvatar?.toUpperCase().substr(0, 2)}
            </Avatar>
          )}
        </HStack>
      </Box>
    )
  ) : (
    <React.Fragment />
  )
}
