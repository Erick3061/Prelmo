import Color from 'color';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Text from '../components/Text'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { IconButton } from '../components/IconButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { stylesApp } from '../App';
import { useMutation } from '@tanstack/react-query';
import { HandleContext } from '../context/HandleContext';
import { setUser } from '../features/appSlice';
import Animated, { BounceOut, FadeInUp, FlipInEasyY } from 'react-native-reanimated';
import { AccepTerms } from '../api/Api';

interface Props extends NativeStackScreenProps<rootStackScreen, 'TCAP'> { };
export const TCAPScreen = ({ navigation, route: { params } }: Props) => {
    const { theme: { colors, roundness, dark } } = useAppSelector(state => state.app);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;
    const accept: boolean = false;
    const appDispatch = useAppDispatch();
    const { handleError } = useContext(HandleContext);

    const { mutate: mutateTerms } = useMutation(['Terms'], AccepTerms, {
        retry: 0,
        onError: async err => handleError(String(err)),
        onSuccess: () => {
            navigation.goBack();
            params?.user && appDispatch(setUser(params.user));
        },
    });

    return (
        <Animated.View entering={FadeInUp} style={{ flex: 1 }}>
            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: colors.backdrop, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View entering={FlipInEasyY} exiting={BounceOut} style={[
                    {
                        position: 'absolute',
                        width: '95%',
                        height: '90%',
                        padding: 10,
                        borderRadius: roundness * 4,
                        backgroundColor: backgroundColor,
                    },
                    stylesApp.shadow,
                    { shadowColor: colors.primary }
                ]}>
                    <View>
                        <IconButton iconsize={30} name='close' style={{ alignSelf: 'flex-end' }} onPress={() => navigation.goBack()} />
                    </View>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
                        <Text variant='titleLarge' style={[style.title]}>{accept ? '¿ Aceptas términos y condiciones ?' : 'términos y condiciones'}</Text>
                        <TC />
                        <Text variant='titleLarge' style={[style.title]}>{accept ? '¿ Aceptas aviso de privacidad ?' : 'aviso de privacidad'}</Text>
                        <Ap />
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 }}>
                        {
                            params?.user && <Button text='Aceptar' mode='contained' contentStyle={{ backgroundColor: colors.success }} onPress={() => mutateTerms(params.user.token)} />
                        }
                        <Button text='cancel' mode='contained' contentStyle={{ backgroundColor: colors.danger }} onPress={() => navigation.goBack()} />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </Animated.View>
    )
}

const TC = () => {
    return (
        <>
            <Text style={[style.text]}>
                Es obligación del usuario de la aplicación, así como del titular respectivo, informar cambios en el personal que emplea la aplicación, notificando altas y bajas de manera oportuna.
            </Text>
            <Text style={[style.text]}>
                La información proporcionada por la aplicación es de uso exclusivo para el usuario y PEMSA no es responsable del uso que dicho usuario haga de la información consultada.
            </Text>
            <Text style={[style.text]}>
                El acceso a la información para consulta del cliente es independiente a la información resguardada
                en los servidores de PEMSA, y la falta de acceso a la misma no exime de ninguna manera al cliente
                del pago por el monitoreo de su sistema de alarma en adición a cualquier otro servicio contratado
                u obligaciones adquiridas con PEMSA.
            </Text>
            <Text style={[style.text]}>
                Para acceder a la aplicación se requiere de un registro previo con el formato correspondiente por
                parte del titular a el cual solicitará por conducto de su asesor comercial.
            </Text>
            <Text style={[style.text]}>
                PEMSA se reserva el derecho de brindar o denegar autorización de usuarios y titulares para el uso
                de su plataforma.
            </Text>
            <Text style={[style.text]}>La aplicación puede ser sometida a actualizaciones sin previo aviso.</Text>
        </>
    )
}
const Ap = () => {
    return (
        <>
            <Text style={[style.term]}>
                <Text style={[style.res]}>Protección Electrónica Monterrey SA de CV</Text>, en lo sucesivo <Text style={[style.res]}>PEMSA</Text> en su carácter de responsable encargado del tratamiento de sus datos personales, manifiesta que, para efectos del presente aviso, su domicilio se encuentra ubicado en la calle 33 Poniente 307, Colonia Chulavista, C.P. 72420; Puebla, Puebla, México.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> presenta este aviso de privacidad con la finalidad de dar cumplimiento a los artículos 15, 16 y demás relativos de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LA LEY).
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> se compromete a que estos datos serán tratados bajo las más estrictas medidas de seguridad que garanticen su confidencialidad.
            </Text>
            <Text style={[style.term]}>
                Los referidos datos personales se incorporarán a las distintas bases de datos de <Text style={[style.res]}>PEMSA</Text>, razón por la cual <Text style={[style.res]}>EL CLIENTE</Text> autoriza que <Text style={[style.res]}>PEMSA</Text> realice el tratamiento de sus datos personales de conformidad con las finalidades más adelante descritas, para utilizarlos durante el desarrollo de las operaciones y servicios contratados. <Text style={[style.res]}>PEMSA</Text> tendrá la responsabilidad de protegerlos mientras estén en su poder.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>1. Datos Personales Recibidos del Cliente</Text>
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>EL CLIENTE</Text> acepta de manera expresa entregar a <Text style={[style.res]}>PEMSA</Text> para su tratamiento, de manera enunciativa más no limitativa los siguientes datos personales:
            </Text>

            <Text style={[style.textAp]}>a) Datos generales del titular y/o personal autorizado: Apellido Paterno, Apellido Materno, Nombre(s), identificación oficial, correo electrónico, empresa donde labora y compañía que representa.</Text>
            <Text style={[style.textAp]}>b) Domicilio: Calle, número exterior, número interior, colonia, código postal, Estado, delegación/municipio, teléfono, correo electrónico.</Text>

            <Text style={[style.term]}>
                <Text style={[style.res]}>Datos Personales Sensibles.</Text> - Para cumplir con las finalidades previstas en este Aviso de Privacidad, <Text style={[style.res]}>PEMSA</Text> hace de su conocimiento que no se tratarán datos personales sensibles:
            </Text>
            <Text style={[style.term]}>
                En caso contrario se le darán los avisos respectivos para recabar debidamente su consentimiento expreso.
            </Text>
            <Text style={[style.term]}>
                Estos datos serán tratados bajo las más estrictas medidas de seguridad que garanticen su confidencialidad.
            </Text>
            <Text style={[style.term]}>
                Podrán tratarse otros datos personales, sensibles y no sensibles, que no se incluyan en las listas anteriores siempre y cuando dichos datos se consideren de la misma naturaleza y no sean excesivos respecto a las finalidades para los cuales se recaban.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>2. Finalidad de los Datos Personales</Text>
            </Text>

            <Text style={[style.term]}>
                <Text style={[style.res]}>El CLIENTE</Text> consiente que sus datos personales sean utilizados por <Text style={[style.res]}>PEMSA</Text> con la <Text style={[style.res]}>finalidad principal</Text> de:
            </Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>1.</Text> Identificación, localización y contacto con el titular y encargados.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>2.</Text> Verificar y confirmar su identidad.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>3.</Text> Monitoreo de sus sistemas de alarmas.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>4.</Text> Consulta de los eventos recibidos en nuestra central de monitoreo.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>5.</Text> Atención sus solicitudes, quejas, dudas y/o comentarios relacionados con nuestros servicios.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>6.</Text> Las demás finalidades que resulten necesarias para la prestación de los servicios por usted requeridos.</Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>Finalidades Secundarias</Text>
            </Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>1.</Text> Realizar estudios y procesos internos.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>2.</Text> Realizar encuestas de calidad en el servicio y atención a clientes.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>3.</Text> Para fines mercadotécnicos, publicitarios o de prospección comercial.</Text>
            <Text style={[style.textAp]}><Text style={[style.res]}>4.</Text> Cumplir con los requisitos legales y reglamentarios aplicables.</Text>
            <Text style={[style.term]}>
                En caso de que no desee que sus datos personales sean tratados para estas finalidades secundarias, usted tiene un plazo máximo de 5 (cinco) días hábiles para comunicar lo anterior a la Dirección de Contacto: <Text style={[style.res]}>datospersonales@pem-sa.com</Text> La negativa para el uso de sus datos personales para estas finalidades secundarias, no podrá ser un motivo para que le neguemos los servicios y productos que solicita o contrata con nosotros.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>3. Seguridad de los Datos Personales</Text>
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> implementará las medidas de seguridad técnicas, administrativas y físicas necesarias para procurar la integridad de sus datos personales y evitar su daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado.
            </Text>
            <Text style={[style.term]}>
                Únicamente el personal autorizado, que ha cumplido y observado los correspondientes requisitos de confidencialidad, podrá participar en el tratamiento de sus datos personales. El personal autorizado tiene prohibido permitir el acceso de personas no autorizadas  y/o utilizar los  datos personales  para fines  distintos  a los  establecidos  en el  presente Aviso de Privacidad.  La obligación de confidencialidad de las personas que participan en el tratamiento de sus datos personales subsiste aún después de terminada la relación con <Text style={[style.res]}>PEMSA</Text>.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>4. Transferencias</Text>
            </Text>
            <Text style={[style.term]}>
                Para efectos de este aviso de privacidad en la Aplicación móvil (APP) no se harán transferencias de sus datos personales a terceros. En caso contrario se pondrán a su disposición los documentos necesarios a fin de recabar su consentimiento expreso.
            </Text>
            <Text style={[style.term]}>
                Se podrán transmitir sus datos personales a las autoridades competentes, locales y federales cuando se encuentre dentro de las excepciones señaladas en la Ley y su Reglamento. En el caso de transferencias, tratamiento de sus datos personales sensibles, financieros y bancarios, se requerirá su consentimiento expreso, mediante la firma del aviso de privacidad respectivo.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> podrá transmitir libremente los datos personales de <Text style={[style.res]}>EL CLIENTE</Text> a las sociedades controladoras, subsidiarias o filiales, a una sociedad matriz o a cualquier sociedad de <Text style={[style.res]}>PEMSA </Text>que opere bajo los mismos procesos y políticas internas.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>5. Limitaciones de la Divulgación de Información</Text>
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> se compromete a no transferir su información personal a terceros adicionales a los mencionados en el numeral anterior sin su consentimiento y en caso de que <Text style={[style.res]}>EL CLIENTE</Text> haya consentido que se realicen transferencias, <Text style={[style.res]}>PEMSA</Text> hará del conocimiento del <Text style={[style.res]}>CLIENTE</Text> a través de medios impresos o electrónicos la finalidad por la que dicha información será transferida a terceros; asimismo <Text style={[style.res]}>PEMSA</Text> informará a través de los mismos medios por los que se recabaron los datos personales (domicilio físico y/o dirección de correo electrónico) los cambios que se realicen al aviso de privacidad.

            </Text>
            <Text style={[style.term]}>
                De igual forma <Text style={[style.res]}>EL CLIENTE</Text> se compromete a dar aviso a <Text style={[style.res]}>PEMS</Text>A sobre cualquier cambio respecto a su domicilio físico y/o dirección de correo electrónico, o personas autorizadas a usar la APP con la finalidad de que <Text style={[style.res]}>PEMSA</Text> pueda comunicarse con <Text style={[style.res]}>EL CLIENTE</Text> para informar cualquier cambio o modificación respecto de lo contenido en el presente aviso de privacidad.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> no necesitará el consentimiento de <Text style={[style.res]}>EL CLIENTE</Text> para transferir a terceras personas su información en los siguientes casos:
            </Text>
            <Text style={[style.textAp]}>a) Cuando la transferencia esté prevista en una Ley o Tratado en los que México sea parte.</Text>
            <Text style={[style.textAp]}>b) Cuando la transferencia sea necesaria para la prevención o el diagnóstico médico, la prestación de asistencia sanitaria, tratamiento médico o la gestión de servicios sanitarios.</Text>
            <Text style={[style.textAp]}>c) Cuando sea requerida por autoridades competentes de conformidad con las disposiciones legales aplicables.</Text>

            <Text style={[style.term]}>
                <Text style={[style.res]}>6.  Medios para ejercer los derechos de acceso, rectificación, cancelación y oposición (ARCO) de los datos personales</Text>
            </Text>

            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> ha designado a un encargado de datos personales, (el “oficial de Privacidad”), por lo tanto, usted podrá limitar el uso o divulgación de sus datos personales mediante comunicación dirigida al Oficial de Privacidad al correo electrónico siguiente:<Text style={[style.res]}>datospersonales@pem-sa.com</Text> (la “Dirección de Contacto”).
            </Text>
            <Text style={[style.term]}>
                Usted tiene derecho de: (i) acceder a sus datos personales en nuestro poder y conocer los detalles del tratamiento de los mismos, (ii) rectificarlos en caso de ser inexactos o incompletos, (iii) cancelarlos cuando considere que no se requieren para alguna de las finalidades señaladas en el presente Aviso de Privacidad, estén siendo utilizados para finalidades no consentidas o haya finalizado la relación contractual o de servicio, o (iv) oponerse al tratamiento de los mismos para fines específicos, según lo diga la ley, (conjuntamente, los “Derechos ARCO”).
            </Text>
            <Text style={[style.term]}>
                Los Derechos ARCO se ejercerán mediante la presentación de la solicitud respectiva, la cual deberá ser solicitada al Oficial de privacidad al correo: <Text style={[style.res]}>datospersonales@pem-sa.com</Text> acompañada de la siguiente información y documentación:
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>I. </Text>Su nombre, domicilio y correo electrónico para poder comunicarle la respuesta a la Solicitud ARCO;
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>II. </Text>Los documentos que acrediten su identidad (copia de IFE, pasaporte o cualquier otra identificación oficial) o en su caso, los documentos que acrediten su representación legal;
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>III. </Text>Una descripción clara y precisa de los datos personales respecto de los cuales busca ejercer alguno de los Derechos ARCO;
                IV.Cualquier documento o información que facilite la localización de sus datos personales;
                V.En caso de solicitar una rectificación de datos, deberá de indicar también, las modificaciones a realizarse y aportar la documentación que sustente su petición; y
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>VI. </Text>La indicación del lugar donde podremos revisar los originales de la documentación que acompañe.
            </Text>
            <Text style={[style.term]}>
                Su Solicitud ARCO será contestada mediante un correo electrónico por parte del Oficial de Privacidad en un plazo máximo de 20 (veinte) días hábiles contados desde el día en que se haya recibido su Solicitud ARCO. En caso de que la Solicitud ARCO se conteste de manera afirmativa o procedente, tales cambios se harán en un plazo máximo de 15 (quince) días hábiles. Los plazos referidos en este párrafo se podrán prorrogar por una vez por un periodo igual en caso de ser necesario.
            </Text>
            <Text style={[style.term]}>
                Es importante comunicarle que <Text style={[style.res]}>PEMSA</Text> podrá negar el acceso (la “Negativa”) para que usted ejerza sus derechos ARCO en los siguientes supuestos:
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>I. </Text>Cuando Usted no sea el titular de los datos personales, o su representante legal no esté debidamente acreditado para ejercer por medio de él, sus Derechos ARCO;
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>II. </Text>Cuando en nuestra base de datos no se encuentren sus datos personales;
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>III. </Text>Cuando se lesionen los derechos de un tercero;
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>IV. </Text>Cuando exista un impedimento legal o la resolución de una autoridad competente, que restrinja sus Derechos ARCO; y
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>V. </Text>Cuando la Rectificación, Cancelación u Oposición haya sido previamente realizada.
            </Text>
            <Text style={[style.term]}>
                En relación con lo anterior, la Negativa podrá ser parcial, en cuyo caso <Text style={[style.res]}>PEMSA</Text> efectuará el acceso, rectificación, cancelación u oposición en la parte procedente.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>PEMSA</Text> siempre le informará el motivo de su decisión y se la comunicará a Usted o en su caso, a su representante legal, en los plazos anteriormente establecidos, por correo electrónico, acompañando, en su caso, las pruebas que resulten pertinentes.
            </Text>
            <Text style={[style.term]}>
                El ejercicio de los Derechos ARCO será gratuito, previa acreditación de su identidad ante el responsable, pero si Usted reitera su solicitud en un periodo menor a doce meses, los costos serán de tres días de la Unidad de Medida y Actualización Vigente, más I.V.A., a menos que existan modificaciones sustanciales al Aviso de Privacidad que motiven nuevas consultas. En todos los casos, la entrega de los datos personales será gratuita, con la excepción de que Usted deberá de cubrir los gastos justificados de envío o el costo de reproducción en copias u otros formatos.
            </Text>
            <Text style={[style.term]}>
                <Text style={[style.res]}>EL CLIENTE</Text> podrá revocar el consentimiento que ha otorgado a PEMSA para el tratamiento de los datos personales que no sean indispensables para el cumplimiento de las obligaciones derivadas del vínculo jurídico que les une, a fin de que <Text style={[style.res]}>PEMSA</Text> deje de hacer uso de los mismos. Para ello, es necesario que <Text style={[style.res]}>EL CLIENTE</Text> presente su petición en los términos antes mencionados.
            </Text>

            <Text style={[style.term]}>
                <Text style={[style.res]}>7. Mecanismo para revocación del consentimiento.</Text>
            </Text>
            <Text style={[style.term]}>
                En caso de que Usted decida revocar su consentimiento para que <Text style={[style.res]}>PEMSA</Text> deje de llevar a cabo el tratamiento de sus datos personales, o se oponga a la transferencia de los mismos, deberá de enviar una solicitud de revocación de consentimiento a la Dirección de Contacto, y deberá de ser acompañada en el correo electrónico de los documentos que acrediten su identidad (copia de IFE, pasaporte o cualquier otra identificación oficial) o en su caso, los documentos que acrediten su representación legal y la indicación del lugar en el cual se pone a nuestra disposición los documentos originales.
            </Text>
            <Text style={[style.term]}>
                Para conocer el procedimiento y requisitos para la revocación del consentimiento, usted podrá ponerse en contacto con nuestro Oficial de Privacidad en el correo electrónico siguiente: <Text style={[style.res]}>datospersonales@pem-sa.com</Text>
            </Text>
            <Text style={[style.term]}>
                De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos (en adelante “Reglamento general de protección de datos” o “GDPR”), <Text style={[style.res]}>PEMSA</Text> se compromete a seguir obteniendo su consentimiento expreso para adquirir, procesar y tratar sus datos personales de conformidad con lo establecido en el GDPR.
            </Text>
            <Text style={[style.term]}>
                El presente Aviso de Privacidad y sus cambios será publicado en las oficinas de <Text style={[style.res]}>PEMSA</Text> y/o en la página electrónica siguiente: <Text style={[style.res]}>www.pem-sa.com</Text>
            </Text>
        </>
    )
}

const style = StyleSheet.create({
    title: {
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    text: {
        textAlign: 'justify',
        marginVertical: 3
    },
    res: {
        fontWeight: 'bold'
    },
    term: {
        textAlign: 'justify',
        marginVertical: 3
    },
    textAp: {
        textAlign: 'justify',
    }
});