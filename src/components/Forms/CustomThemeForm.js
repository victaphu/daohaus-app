import React, { useState, useRef } from 'react';
import {
  Button,
  Flex,
  Stack,
  ButtonGroup,
  Box,
  Select,
  Image,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { SketchPicker } from 'react-color';
import { useModals, useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import GenericModal from '../Modal/GenericModal';
import { ipfsPost, ipfsPrePost } from '../../utils/requests';

const bodyFonts = [
  'Rubik',
  'Merriweather',
  'Space Grotesk',
  'Montserrat',
  'Playfair Display',
  'Rokkitt',
];

const headingFonts = [
  'Inknut Antiqua',
  'Bungee',
  'Abril Fatface',
  ...bodyFonts,
];

const dataFonts = [
  'Space Mono',
  'JetBrains Mono',
  'Roboto Mono',
  'Cutive Mono',
];

const ThemeColorsForm = ({
  previewTheme,
  setPreviewTheme,
  handlePreviewUpdate,
  handleThemeUpdate,
  resetTheme,
}) => {
  const [theme] = useTheme();
  const [dao] = useDao();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePicker, setImagePicker] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(null);
  const { modals, openModal, closeModals } = useModals();
  let upload = useRef();

  console.log(previewTheme);

  const handleChange = (color, item) => {
    setPreviewTheme({
      ...previewTheme,
      [item]: color.hex,
    });
    setPickerOpen(null);
  };

  const handleSelectChange = (event) => {
    setPreviewTheme({
      ...previewTheme,
      [event.target.id]: event.target.value,
    });
  };

  const handleBrowse = () => {
    upload.value = null;
    upload.click();
  };

  const handleFileSet = async (event) => {
    console.log(event);
    setImageUrl(URL.createObjectURL(upload.files[0]));
    const formData = new FormData();
    formData.append('file', upload.files[0]);
    setImageUpload(formData);
    openModal('imageHandler');
  };
  console.log(imagePicker);

  const handleUpload = async () => {
    console.log('uploading', imageUpload);

    const keyRes = await ipfsPrePost('dao/ipfs-key', {
      daoAddress: dao.address,
    });

    console.log('keyRes', keyRes);

    const ipfsRes = await ipfsPost(keyRes, imageUpload);

    console.log('ipfsRes', ipfsRes);
    setPreviewTheme({
      ...previewTheme,
      [imagePicker]: ipfsRes.IpfsHash,
    });
    setImagePicker(null);
    setImageUpload(null);
    setImageUrl(null);
    closeModals();
  };

  return (
    <>
      <ContentBox m={6}>
        <GenericModal isOpen={modals.imageHandler}>
          <Flex align='center' direction='column'>
            <TextBox>How&apos;s this look?</TextBox>
            <Image src={imageUrl} maxH='500px' objectFit='cover' my={4} />
            <ButtonGroup>
              <Button variant='outline' onClick={handleBrowse}>
                Select Another
              </Button>
              <Button onClick={handleUpload}>Confirm</Button>
            </ButtonGroup>
          </Flex>
        </GenericModal>
        <Stack spacing={4} pr='5%'>
          <TextBox size='xs'>Colors</TextBox>
          <Flex justify='space-between' align='center'>
            <TextBox size='sm'>Primary</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={previewTheme?.primary500}
              onClick={() => setPickerOpen('primary')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'primary' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={previewTheme?.primary500}
                    onChange={(color) => handleChange(color, 'primary500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>

          <Flex justify='space-between' align='center'>
            <TextBox size='sm'>Secondary</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={previewTheme?.secondary500}
              onClick={() => setPickerOpen('secondary')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'secondary' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={previewTheme?.secondary500}
                    onChange={(color) => handleChange(color, 'secondary500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>

          <Flex justify='space-between' align='center'>
            <TextBox size='sm'>Background</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={previewTheme?.background500}
              onClick={() => setPickerOpen('background')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'background' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={previewTheme?.background500}
                    onChange={(color) => handleChange(color, 'background500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>
          <TextBox size='xs'>Fonts</TextBox>
          <Box>
            <TextBox size='sm' mb={1}>
              Heading
            </TextBox>
            <Select
              defaultValue={
                previewTheme.headingFont
                  ? previewTheme.headingFont
                  : 'Inknut Antiqua'
              }
              onChange={handleSelectChange}
              w='80%'
              icon={<AiOutlineCaretDown />}
              name='primaryFont'
              id='primaryFont'
            >
              {headingFonts.map((value) => (
                <Box as='option' key={value}>
                  {value}
                </Box>
              ))}
            </Select>
          </Box>
          <Box>
            <TextBox size='sm' mb={1}>
              Body
            </TextBox>
            <Select
              defaultValue={
                previewTheme.headingFont
                  ? previewTheme.headingFont
                  : 'Inknut Antiqua'
              }
              onChange={handleSelectChange}
              w='80%'
              icon={<AiOutlineCaretDown />}
              name='bodyFont'
              id='bodyFont'
            >
              {bodyFonts.map((value) => (
                <Box as='option' key={value}>
                  {value}
                </Box>
              ))}
            </Select>
          </Box>
          <Box>
            <TextBox size='sm' mb={1}>
              Data
            </TextBox>
            <Select
              defaultValue={
                previewTheme.headingFont
                  ? previewTheme.headingFont
                  : 'Inknut Antiqua'
              }
              onChange={handleSelectChange}
              w='80%'
              icon={<AiOutlineCaretDown />}
              name='monoFont'
              id='monoFont'
            >
              {dataFonts.map((value) => (
                <Box as='option' key={value} id={value}>
                  {value}
                </Box>
              ))}
            </Select>
          </Box>
        </Stack>

        <Flex direction='column' justify='center' my={6}>
          <TextBox size='sm' mb={1}>
            Images
          </TextBox>
          <ButtonGroup>
            <Button
              id='brandImg'
              variant='outline'
              onClick={() => {
                setImagePicker('brandImg');
                handleBrowse();
              }}
            >
              Logo
            </Button>
            <Button
              id='bgImg'
              mb={3}
              variant='outline'
              onClick={() => {
                setImagePicker('bgImg');
                handleBrowse();
              }}
            >
              Background
            </Button>
          </ButtonGroup>
        </Flex>
      </ContentBox>
      <input
        type='file'
        id='brandImg'
        accept='image/gif, image/jpeg, image/png'
        multiple={false}
        style={{ display: 'none' }}
        ref={(ref) => (upload = ref)}
        onChange={(e) => handleFileSet(e)}
      />
      <input
        type='file'
        id='bgImg'
        accept='image/gif, image/jpeg, image/png'
        multiple={false}
        style={{ display: 'none' }}
        ref={(ref) => (upload = ref)}
        onChange={(e) => handleFileSet(e)}
      />
    </>
  );
};

export default ThemeColorsForm;
