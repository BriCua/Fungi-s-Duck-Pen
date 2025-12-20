import React, { useState } from 'react';
import { Button } from '../components/ui';
import { useAuthContext } from '../context/AuthContext';
import { coupleService } from '../firebase/coupleService';
import { Spinner } from '../components/ui/Spinner';
import { AboutHeader } from '../components/profile/AboutHeader';
import { Stats } from '../components/profile/Stats';
import { CoupleInfo } from '../components/profile/CoupleInfo';
import { SpecialDates } from '../components/profile/SpecialDates';
import { AddSpecialDateModal } from '../components/profile/AddSpecialDateModal';
import { UpdateSpecialDateModal } from '../components/profile/UpdateSpecialDateModal';
import { EditFieldModal } from '../components/profile/EditFieldModal';
import type { SpecialDate } from '../types/couple';
import { PageHeader } from '../components/ui/PageHeader';

export const ProfilePage: React.FC = () => {
  const { couple, loading, signOut, setCouple } = useAuthContext();
  const [error, setError] = useState('');

  // State for Add Modal
  const [isAddSpecialDateModalOpen, setIsAddSpecialDateModalOpen] = useState(false);
  const [addSpecialDateError, setAddSpecialDateError] = useState('');
  const [isSavingSpecialDate, setIsSavingSpecialDate] = useState(false);
  
  // State for Update Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<SpecialDate | null>(null);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // State for EditField Modals
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);
  const [editingFieldKey, setEditingFieldKey] = useState<'relationshipStatus' | 'meetStory' | null>(null);
  const [editingFieldValue, setEditingFieldValue] = useState('');
  const [editFieldError, setEditFieldError] = useState('');
  const [isSavingField, setIsSavingField] = useState(false);

  const relationshipStatuses = ["Dating", "Engaged", "Married", "It's Complicated"];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Failed to sign out:", err);
      setError("Failed to sign out. Please try again.");
    }
  };

  const handleSaveSpecialDate = async (name: string, date: Date, recurring: boolean) => {
    if (!couple?.coupleId) {
      setAddSpecialDateError("Couple not found. Cannot add special date.");
      return;
    }
    setIsSavingSpecialDate(true);
    setAddSpecialDateError('');

    try {
      const newSpecialDate = await coupleService.addSpecialDate(couple.coupleId, name, date.getTime(), recurring);
      
      const updatedSpecialDates = [...(couple.specialDates || []), newSpecialDate];
      setCouple({ ...couple, specialDates: updatedSpecialDates });

      setIsAddSpecialDateModalOpen(false);
    } catch (err) {
      console.error("Failed to add special date:", err);
      setAddSpecialDateError(err instanceof Error ? err.message : "An unknown error occurred while saving the special date.");
    } finally {
      setIsSavingSpecialDate(false);
    }
  };

  const handleDateClick = (date: SpecialDate) => {
    setSelectedDate(date);
    setIsUpdateModalOpen(true);
  };
  
  const handleUpdateSpecialDate = async (id: string, name: string, date: Date, recurring: boolean) => {
    if (!couple?.coupleId) {
      setUpdateError("Couple not found. Cannot update special date.");
      return;
    }
    setIsUpdating(true);
    setUpdateError('');

    try {
      const updatedDate = { id, name, date: date.getTime(), recurring };
      await coupleService.updateSpecialDate(couple.coupleId, updatedDate);
      
      const updatedSpecialDates = couple.specialDates?.map(d => d.id === id ? updatedDate : d) || [];
      setCouple({ ...couple, specialDates: updatedSpecialDates });

      setIsUpdateModalOpen(false);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteSpecialDate = async (id: string) => {
    if (!couple?.coupleId) {
      setUpdateError("Couple not found. Cannot delete special date.");
      return;
    }
    setIsUpdating(true);
    setUpdateError('');

    try {
      await coupleService.deleteSpecialDate(couple.coupleId, id);
      
      const updatedSpecialDates = couple.specialDates?.filter(d => d.id !== id) || [];
      setCouple({ ...couple, specialDates: updatedSpecialDates });

      setIsUpdateModalOpen(false);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditField = (field: 'relationshipStatus' | 'meetStory', currentValue: string) => {
    setEditingFieldKey(field);
    setEditingFieldValue(currentValue);
    setIsEditFieldModalOpen(true);
    setEditFieldError('');
  };

  const handleSaveField = async (newValue: string) => {
    if (!couple?.coupleId || !editingFieldKey) {
      setEditFieldError("Couple not found or field not selected.");
      return;
    }
    setIsSavingField(true);
    setEditFieldError('');

    try {
      const payload = { [editingFieldKey]: newValue };
      await coupleService.updateCoupleDetails(couple.coupleId, payload);
      
      setCouple({ ...couple, ...payload }); // Update local context
      setIsEditFieldModalOpen(false);
    } catch (err) {
      setEditFieldError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSavingField(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="font-baloo">
      <PageHeader title="About Us" />

      <div className='p-6'>
        <AboutHeader />

        {error && <div className="mb-6 bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}

        <Stats />

        <CoupleInfo 
          onEditRelationshipStatus={(currentStatus) => handleEditField('relationshipStatus', currentStatus)}
          onEditMeetStory={(currentStory) => handleEditField('meetStory', currentStory)}
        />

        <SpecialDates 
          couple={couple} 
          onAddSpecialDate={() => setIsAddSpecialDateModalOpen(true)}
          onDateClick={handleDateClick}
        />

        <div className="text-center mt-8">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <AddSpecialDateModal
        isOpen={isAddSpecialDateModalOpen}
        onClose={() => setIsAddSpecialDateModalOpen(false)}
        onSave={handleSaveSpecialDate}
        isLoading={isSavingSpecialDate}
        error={addSpecialDateError}
      />
      
      <UpdateSpecialDateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={handleUpdateSpecialDate}
        onDelete={handleDeleteSpecialDate}
        isLoading={isUpdating}
        error={updateError}
        specialDate={selectedDate}
      />

      {editingFieldKey && (
        <EditFieldModal
          isOpen={isEditFieldModalOpen}
          onClose={() => setIsEditFieldModalOpen(false)}
          onSave={handleSaveField}
          isLoading={isSavingField}
          error={editFieldError}
          title={`Edit ${editingFieldKey === 'relationshipStatus' ? 'Relationship Status' : 'Our Story'}`}
          label={editingFieldKey === 'relationshipStatus' ? 'Relationship Status' : 'Our Story'}
          initialValue={editingFieldValue}
          isTextArea={editingFieldKey === 'meetStory'}
          options={editingFieldKey === 'relationshipStatus' ? relationshipStatuses : undefined}
        />
      )}
    </div>
  );
};